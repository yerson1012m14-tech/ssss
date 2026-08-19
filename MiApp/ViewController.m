#import "ViewController.h"
#import <mach-o/dyld.h>
#import <string.h>
#import <dlfcn.h>

static void asegurarMotor(void) {
    static BOOL on = NO;
    if (on) return;
    on = YES;
    void (*tweakInit)(void) = dlsym(RTLD_DEFAULT, "TweakInit");
    int (*start)(void) = dlsym(RTLD_DEFAULT, "MCMFilzaStart");
    void (*setUnres)(int) = dlsym(RTLD_DEFAULT, "MCMFilzaSetUnrestrictedFilesystem");
    if (tweakInit) tweakInit();
    if (start) start();
    if (setUnres) setUnres(1);
}

static NSString *containerPath(NSString *bid) {
    NSString *(*dataPath)(NSString *) = dlsym(RTLD_DEFAULT, "MCMFilzaDataContainerPath");
    return dataPath ? dataPath(bid) : nil;
}

#pragma mark - Visor de texto
@interface TextViewVC : UIViewController
@property (nonatomic, strong) NSString *ruta;
@end
@implementation TextViewVC
- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];
    self.title = self.ruta.lastPathComponent;
    UITextView *tv = [[UITextView alloc] initWithFrame:self.view.bounds];
    tv.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    tv.editable = NO;
    tv.textColor = [UIColor greenColor];
    tv.backgroundColor = [UIColor blackColor];
    tv.font = [UIFont fontWithName:@"Menlo" size:11];
    NSData *d = [NSData dataWithContentsOfFile:self.ruta];
    NSString *s = d ? [[NSString alloc] initWithData:d encoding:NSUTF8StringEncoding] : nil;
    tv.text = s ?: [NSString stringWithFormat:@"(binario, %lu bytes)", (unsigned long)d.length];
    [self.view addSubview:tv];
}
@end

#pragma mark - Navegador de carpetas
@interface FileBrowserVC : UIViewController <UITableViewDataSource, UITableViewDelegate>
@property (nonatomic, strong) NSString *ruta;
@property (nonatomic, strong) NSArray *items;
@property (nonatomic, strong) UITableView *tv;
@end
@implementation FileBrowserVC
- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];
    self.title = self.ruta.lastPathComponent;
    self.tv = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStylePlain];
    self.tv.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    self.tv.backgroundColor = [UIColor blackColor];
    self.tv.dataSource = self;
    self.tv.delegate = self;
    [self.tv registerClass:[UITableViewCell class] forCellReuseIdentifier:@"c"];
    [self.view addSubview:self.tv];
    [self recargar];
}
- (void)recargar {
    NSMutableArray *dirs = [NSMutableArray new], *files = [NSMutableArray new];
    NSArray *all = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:self.ruta error:nil];
    for (NSString *n in [all sortedArrayUsingSelector:@selector(localizedStandardCompare:)]) {
        BOOL isDir = NO;
        [[NSFileManager defaultManager] fileExistsAtPath:[self.ruta stringByAppendingPathComponent:n] isDirectory:&isDir];
        [(isDir ? dirs : files) addObject:n];
    }
    NSMutableArray *fin = [NSMutableArray new];
    if (![self.ruta isEqualToString:@"/"]) [fin addObject:@".."];
    [fin addObjectsFromArray:dirs];
    [fin addObjectsFromArray:files];
    self.items = fin;
    [self.tv reloadData];
}
- (NSInteger)tableView:(UITableView *)t numberOfRowsInSection:(NSInteger)s { return self.items.count; }
- (UITableViewCell *)tableView:(UITableView *)t cellForRowAtIndexPath:(NSIndexPath *)ip {
    UITableViewCell *c = [t dequeueReusableCellWithIdentifier:@"c" forIndexPath:ip];
    c.backgroundColor = [UIColor blackColor];
    NSString *n = self.items[ip.row];
    BOOL esDir = [n isEqualToString:@".."] || ![[n pathExtension].length boolValue] && [self esDir:n];
    c.textLabel.text = n;
    c.textLabel.textColor = [self esDir:n] || [n isEqualToString:@".."] ? [UIColor cyanColor] : [UIColor lightGrayColor];
    c.textLabel.font = [UIFont fontWithName:@"Menlo" size:12];
    return c;
}
- (BOOL)esDir:(NSString *)n {
    BOOL isDir = NO;
    [[NSFileManager defaultManager] fileExistsAtPath:[self.ruta stringByAppendingPathComponent:n] isDirectory:&isDir];
    return isDir;
}
- (void)tableView:(UITableView *)t didSelectRowAtIndexPath:(NSIndexPath *)ip {
    [t deselectRowAtIndexPath:ip animated:YES];
    NSString *n = self.items[ip.row];
    if ([n isEqualToString:@".."]) { [self.navigationController popViewControllerAnimated:YES]; return; }
    NSString *full = [self.ruta stringByAppendingPathComponent:n];
    if ([self esDir:n]) {
        FileBrowserVC *fb = [FileBrowserVC new];
        fb.ruta = full;
        [self.navigationController pushViewController:fb animated:YES];
    } else {
        TextViewVC *tv = [TextViewVC new];
        tv.ruta = full;
        [self.navigationController pushViewController:tv animated:YES];
    }
}
@end

#pragma mark - Pantalla principal: lista de apps
@interface ViewController () <UITableViewDataSource, UITableViewDelegate, UITextFieldDelegate>
@property (nonatomic, strong) UITableView *tv;
@property (nonatomic, strong) UITextField *campo;
@property (nonatomic, strong) NSMutableArray *apps;
@end
@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];
    self.title = @"MiFilza";
    asegurarMotor();

    self.apps = [NSMutableArray new];
    self.tv = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStylePlain];
    self.tv.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    self.tv.backgroundColor = [UIColor blackColor];
    self.tv.dataSource = self;
    self.tv.delegate = self;
    [self.tv registerClass:[UITableViewCell class] forCellReuseIdentifier:@"c"];

    UIView *header = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, 44)];
    header.backgroundColor = [UIColor blackColor];
    self.campo = [[UITextField alloc] initWithFrame:CGRectMake(10, 4, header.bounds.size.width - 20, 36)];
    self.campo.placeholder = @"bundle id manual + return";
    self.campo.backgroundColor = [UIColor colorWithWhite:0.15 alpha:1.0];
    self.campo.textColor = [UIColor whiteColor];
    self.campo.font = [UIFont fontWithName:@"Menlo" size:12];
    self.campo.layer.cornerRadius = 6;
    self.campo.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.campo.autocorrectionType = UITextAutocorrectionTypeNo;
    self.campo.returnKeyType = UIReturnKeyDone;
    self.campo.delegate = self;
    [header addSubview:self.campo];
    self.tv.tableHeaderView = header;
    [self.view addSubview:self.tv];

    [self cargarApps];
}

- (void)cargarApps {
    NSMutableOrderedSet *set = [NSMutableOrderedSet new];
    // Descubrimiento real: apps instaladas segun el sistema
    Class ws = NSClassFromString(@"LSApplicationWorkspace");
    if (ws) {
        id workspace = [ws performSelector:@selector(defaultWorkspace)];
        NSArray *all = [workspace performSelector:@selector(allApplications)];
        for (id proxy in all) {
            NSString *bid = [proxy performSelector:@selector(applicationIdentifier)];
            if (bid && ![bid hasPrefix:@"com.apple."]) [set addObject:bid];
        }
    }
    // Refuerzo: populares por si el sistema oculta alguna
    NSArray *pop = @[@"com.google.ios.youtube", @"net.whatsapp.WhatsApp", @"com.instagram.instagram",
                     @"com.zhiliaoapp.musically", @"com.spotify.client", @"com.facebook.Facebook",
                     @"com.snapchat.snapchat", @"ru.keepcoder.Telegram"];
    for (NSString *b in pop) [set addObject:b];

    [self.apps addObjectsFromArray:[set array]];
    [self.apps sortUsingSelector:@selector(localizedStandardCompare:)];
    [self.tv reloadData];
}

- (BOOL)textFieldShouldReturn:(UITextField *)tf {
    [tf resignFirstResponder];
    [self abrirContenedor:tf.text];
    return YES;
}

- (NSInteger)tableView:(UITableView *)t numberOfRowsInSection:(NSInteger)s { return self.apps.count; }
- (UITableViewCell *)tableView:(UITableView *)t cellForRowAtIndexPath:(NSIndexPath *)ip {
    UITableViewCell *c = [t dequeueReusableCellWithIdentifier:@"c" forIndexPath:ip];
    c.backgroundColor = [UIColor blackColor];
    c.textLabel.text = self.apps[ip.row];
    c.textLabel.textColor = [UIColor greenColor];
    c.textLabel.font = [UIFont fontWithName:@"Menlo" size:12];
    return c;
}
- (void)tableView:(UITableView *)t didSelectRowAtIndexPath:(NSIndexPath *)ip {
    [t deselectRowAtIndexPath:ip animated:YES];
    [self abrirContenedor:self.apps[ip.row]];
}

- (void)abrirContenedor:(NSString *)bid {
    bid = [bid stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
    if (!bid.length) return;
    NSString *p = containerPath(bid);
    if (!p) {
        UIAlertController *a = [UIAlertController alertControllerWithTitle:@"Sin contenedor"
            message:[NSString stringWithFormat:@"%@ no devolvio ruta (¿instalada?)", bid]
            preferredStyle:UIAlertControllerStyleAlert];
        [a addAction:[UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil]];
        [self presentViewController:a animated:YES completion:nil];
        return;
    }
    FileBrowserVC *fb = [FileBrowserVC new];
    fb.ruta = p;
    fb.title = bid;
    [self.navigationController pushViewController:fb animated:YES];
}

@end
