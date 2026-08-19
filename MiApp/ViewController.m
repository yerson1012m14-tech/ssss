#import "ViewController.h"
#import <mach-o/dyld.h>

@interface ViewController ()
@property (nonatomic, strong) UITextView *logView;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];
    self.title = @"Mi File Manager";

    self.logView = [[UITextView alloc] init];
    self.logView.editable = NO;
    self.logView.textColor = [UIColor greenColor];
    self.logView.backgroundColor = [UIColor colorWithWhite:0.1 alpha:1.0];
    self.logView.font = [UIFont fontWithName:@"Menlo" size:12];
    self.logView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:self.logView];

    UIButton *btn1 = [self boton:@"1. Ver mi sandbox" accion:@selector(verSandbox)];
    UIButton *btn2 = [self boton:@"2. Probar motor" accion:@selector(probarMotor)];
    UIButton *btn3 = [self boton:@"3. Diagnostico" accion:@selector(diagnostico)];

    [NSLayoutConstraint activateConstraints:@[
        [btn1.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:10],
        [btn1.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [btn1.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [btn1.heightAnchor constraintEqualToConstant:40],
        [btn2.topAnchor constraintEqualToAnchor:btn1.bottomAnchor constant:8],
        [btn2.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [btn2.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [btn2.heightAnchor constraintEqualToConstant:40],
        [btn3.topAnchor constraintEqualToAnchor:btn2.bottomAnchor constant:8],
        [btn3.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [btn3.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [btn3.heightAnchor constraintEqualToConstant:40],
        [self.logView.topAnchor constraintEqualToAnchor:btn3.bottomAnchor constant:10],
        [self.logView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [self.logView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [self.logView.bottomAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.bottomAnchor constant:-10]
    ]];

    [self log:@"App iniciada."];
}

- (UIButton *)boton:(NSString *)titulo accion:(SEL)accion {
    UIButton *b = [UIButton buttonWithType:UIButtonTypeSystem];
    [b setTitle:titulo forState:UIControlStateNormal];
    [b setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    b.backgroundColor = [UIColor darkGrayColor];
    b.translatesAutoresizingMaskIntoConstraints = NO;
    [b addTarget:self action:accion forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:b];
    return b;
}

- (void)log:(NSString *)texto {
    self.logView.text = [self.logView.text stringByAppendingFormat:@"%@\n", texto];
    [self.logView scrollRangeToVisible:NSMakeRange(self.logView.text.length - 1, 1)];
}

- (void)verSandbox {
    [self log:@"--- Mi sandbox ---"];
    NSString *docs = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES).firstObject;
    [self listar:docs];
}

- (void)probarMotor {
    [self log:@"--- Probando motor ---"];
    Class mcm = NSClassFromString(@"MCMFilzaIntegration");
    [self log:(mcm ? @"[OK] Motor detectado en memoria" : @"[!!] Motor NO detectado")];
    [self listar:@"/private/var/mobile/Containers/Data/Application"];
}

- (void)diagnostico {
    [self log:@"--- Diagnostico ---"];

    [self log:@"Dylibs dentro del bundle:"];
    NSArray *files = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:[NSBundle mainBundle].bundlePath error:nil];
    BOOL hayDylib = NO;
    for (NSString *f in files) {
        if ([f hasSuffix:@".dylib"]) { [self log:[NSString stringWithFormat:@"  %@", f]]; hayDylib = YES; }
    }
    if (!hayDylib) [self log:@"  (ninguna)"];

    [self log:@"Librerias cargadas desde el bundle:"];
    uint32_t n = _dyld_image_count();
    BOOL cargada = NO;
    for (uint32_t i = 0; i < n; i++) {
        NSString *name = [NSString stringWithUTF8String:_dyld_get_image_name(i)];
        if ([name containsString:@".app/"]) { [self log:[NSString stringWithFormat:@"  %@", name.lastPathComponent]]; cargada = YES; }
    }
    if (!cargada) [self log:@"  (ninguna)"];
}

- (void)listar:(NSString *)ruta {
    NSError *err = nil;
    NSArray *items = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:ruta error:&err];
    if (items) {
        [self log:[NSString stringWithFormat:@"[%@] %lu elementos:", ruta, (unsigned long)items.count]];
        for (NSString *item in [items subarrayWithRange:NSMakeRange(0, MIN(items.count, 10))]) {
            [self log:[NSString stringWithFormat:@"  - %@", item]];
        }
        if (items.count > 10) [self log:@"  ..."];
    } else {
        [self log:[NSString stringWithFormat:@"[ERROR] %@", err.localizedDescription]];
    }
}

@end
