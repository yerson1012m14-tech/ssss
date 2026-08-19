#import "ViewController.h"
#import <mach-o/dyld.h>
#import <string.h>
#import <dlfcn.h>

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
    self.logView.font = [UIFont fontWithName:@"Menlo" size:11];
    self.logView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:self.logView];

    UIButton *btn1 = [self boton:@"1. Mi sandbox" accion:@selector(verSandbox)];
    UIButton *btn2 = [self boton:@"2. ARRANCAR MOTOR" accion:@selector(arrancarMotor)];
    UIButton *btn3 = [self boton:@"3. LISTAR APPS" accion:@selector(listarApps)];
    UIButton *btn4 = [self boton:@"4. Probar acceso" accion:@selector(probarAcceso)];

    [NSLayoutConstraint activateConstraints:@[
        [btn1.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:8],
        [btn1.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [btn1.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [btn1.heightAnchor constraintEqualToConstant:36],
        [btn2.topAnchor constraintEqualToAnchor:btn1.bottomAnchor constant:6],
        [btn2.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [btn2.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [btn2.heightAnchor constraintEqualToConstant:36],
        [btn3.topAnchor constraintEqualToAnchor:btn2.bottomAnchor constant:6],
        [btn3.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [btn3.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [btn3.heightAnchor constraintEqualToConstant:36],
        [btn4.topAnchor constraintEqualToAnchor:btn3.bottomAnchor constant:6],
        [btn4.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [btn4.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [btn4.heightAnchor constraintEqualToConstant:36],
        [self.logView.topAnchor constraintEqualToAnchor:btn4.bottomAnchor constant:8],
        [self.logView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [self.logView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [self.logView.bottomAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.bottomAnchor constant:-10]
    ]];

    [self log:@"App V7. Pulsa 2 y luego 3."];
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

- (void)probarAcceso {
    [self log:@"--- Probar acceso ---"];
    [self listar:@"/private/var/mobile/Containers/Data/Application"];
}

- (void)arrancarMotor {
    [self log:@"--- Arrancando motor ---"];
    void (*tweakInit)(void) = dlsym(RTLD_DEFAULT, "TweakInit");
    int (*start)(void) = dlsym(RTLD_DEFAULT, "MCMFilzaStart");
    void (*setUnres)(int) = dlsym(RTLD_DEFAULT, "MCMFilzaSetUnrestrictedFilesystem");
    id (*vroot)(void) = dlsym(RTLD_DEFAULT, "MCMFilzaVirtualRoot");

    if (!start) { [self log:@"[!!] motor no encontrado"]; return; }
    if (tweakInit) tweakInit();
    [self log:[NSString stringWithFormat:@"Start: %d", start()]];
    if (setUnres) setUnres(1);
    if (vroot) [self log:[NSString stringWithFormat:@"VirtualRoot: %@", vroot()]];
}

- (void)listarApps {
    [self log:@"--- Enumerando apps ---"];
    NSArray *(*enumIds)(int) = dlsym(RTLD_DEFAULT, "MCMEnumerateIdentifiersForClass");
    NSString *(*dataPath)(NSString *) = dlsym(RTLD_DEFAULT, "MCMFilzaDataContainerPath");
    int (*hasLease)(NSString *) = dlsym(RTLD_DEFAULT, "MCMFilzaPathHasActiveLease");

    if (!enumIds) { [self log:@"[!!] falta funcion de enumerar"]; return; }

    NSArray *ids = enumIds(2);
    if (![ids count]) ids = enumIds(1);
    if (![ids count]) ids = enumIds(0);
    [self log:[NSString stringWithFormat:@"Apps encontradas: %lu", (unsigned long)ids.count]];

    int i = 0;
    for (NSString *bid in ids) {
        if (i++ >= 5) { [self log:@"... (mas apps ocultas)"]; break; }
        [self log:[NSString stringWithFormat:@"APP: %@", bid]];
        if (dataPath) {
            NSString *p = dataPath(bid);
            [self log:[NSString stringWithFormat:@"  ruta: %@", p]];
            if (p) {
                if (hasLease) [self log:[NSString stringWithFormat:@"  lease activa: %d", hasLease(p)]];
                [self listar:p];
            }
        }
    }
}

- (void)listar:(NSString *)ruta {
    NSError *err = nil;
    NSArray *items = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:ruta error:&err];
    if (items) {
        [self log:[NSString stringWithFormat:@"  [%lu archivos]", (unsigned long)items.count]];
        for (NSString *item in [items subarrayWithRange:NSMakeRange(0, MIN(items.count, 8))]) {
            [self log:[NSString stringWithFormat:@"   - %@", item]];
        }
    } else {
        [self log:[NSString stringWithFormat:@"  [ERROR] %@", err.localizedDescription]];
    }
}

@end
