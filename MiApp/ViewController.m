#import "ViewController.h"
#import <mach-o/dyld.h>
#import <string.h>
#import <dlfcn.h>

@interface ViewController () <UITextFieldDelegate>
@property (nonatomic, strong) UITextView *logView;
@property (nonatomic, strong) UITextField *campo;
@property (nonatomic, assign) BOOL motorOn;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];
    self.title = @"Mi File Manager";

    self.campo = [[UITextField alloc] init];
    self.campo.placeholder = @"com.ejemplo.app y pulsa return";
    self.campo.backgroundColor = [UIColor colorWithWhite:0.15 alpha:1.0];
    self.campo.textColor = [UIColor whiteColor];
    self.campo.font = [UIFont fontWithName:@"Menlo" size:12];
    self.campo.layer.cornerRadius = 6;
    self.campo.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.campo.autocorrectionType = UITextAutocorrectionTypeNo;
    self.campo.returnKeyType = UIReturnKeyDone;
    self.campo.delegate = self;
    UIView *pad = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 8, 8)];
    self.campo.leftView = pad;
    self.campo.leftViewMode = UITextFieldViewModeAlways;
    self.campo.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:self.campo];

    self.logView = [[UITextView alloc] init];
    self.logView.editable = NO;
    self.logView.textColor = [UIColor greenColor];
    self.logView.backgroundColor = [UIColor colorWithWhite:0.1 alpha:1.0];
    self.logView.font = [UIFont fontWithName:@"Menlo" size:11];
    self.logView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:self.logView];

    UIButton *btn1 = [self boton:@"1. ARRANCAR MOTOR" accion:@selector(arrancarMotor)];
    UIButton *btn2 = [self boton:@"2. Probar apps del sistema" accion:@selector(probarSistema)];
    UIButton *btn3 = [self boton:@"3. Abrir ID escrito" accion:@selector(abrirEscrito)];

    [NSLayoutConstraint activateConstraints:@[
        [self.campo.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:8],
        [self.campo.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [self.campo.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [self.campo.heightAnchor constraintEqualToConstant:36],
        [btn1.topAnchor constraintEqualToAnchor:self.campo.bottomAnchor constant:6],
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
        [self.logView.topAnchor constraintEqualToAnchor:btn3.bottomAnchor constant:8],
        [self.logView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [self.logView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [self.logView.bottomAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.bottomAnchor constant:-10]
    ]];

    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(cerrarTeclado)];
    [self.view addGestureRecognizer:tap];

    [self log:@"App V9. Escribe un ID y pulsa return."];
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

- (void)cerrarTeclado { [self.view endEditing:YES]; }

- (BOOL)textFieldShouldReturn:(UITextField *)tf {
    [tf resignFirstResponder];
    [self asegurarMotor];
    [self abrirEscrito];
    return YES;
}

- (void)asegurarMotor {
    if (!self.motorOn) { [self arrancarMotor]; self.motorOn = YES; }
}

- (void)log:(NSString *)texto {
    self.logView.text = [self.logView.text stringByAppendingFormat:@"%@\n", texto];
    [self.logView scrollRangeToVisible:NSMakeRange(self.logView.text.length - 1, 1)];
}

- (void)arrancarMotor {
    [self log:@"--- Arrancando motor ---"];
    void (*tweakInit)(void) = dlsym(RTLD_DEFAULT, "TweakInit");
    int (*start)(void) = dlsym(RTLD_DEFAULT, "MCMFilzaStart");
    void (*setUnres)(int) = dlsym(RTLD_DEFAULT, "MCMFilzaSetUnrestrictedFilesystem");
    if (!start) { [self log:@"[!!] motor no encontrado"]; return; }
    if (tweakInit) tweakInit();
    start();
    if (setUnres) setUnres(1);
    [self log:@"Motor arrancado."];
}

- (void)probarSistema {
    [self log:@"--- Apps del sistema ---"];
    [self asegurarMotor];
    NSArray *ids = @[
        @"com.apple.mobilesafari",
        @"com.apple.mobileslideshow",
        @"com.apple.mobilemail",
        @"com.apple.music",
        @"com.apple.Preferences"
    ];
    for (NSString *bid in ids) [self abrirContenedor:bid];
}

- (void)abrirEscrito {
    NSString *bid = [self.campo.text stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
    if (bid.length) [self abrirContenedor:bid];
    else [self log:@"Escribe un bundle id primero."];
}

- (void)abrirContenedor:(NSString *)bid {
    NSString *(*dataPath)(NSString *) = dlsym(RTLD_DEFAULT, "MCMFilzaDataContainerPath");
    int (*hasLease)(NSString *) = dlsym(RTLD_DEFAULT, "MCMFilzaPathHasActiveLease");
    if (!dataPath) { [self log:@"[!!] falta dataPath"]; return; }

    NSString *p = dataPath(bid);
    [self log:[NSString stringWithFormat:@"APP: %@", bid]];
    [self log:[NSString stringWithFormat:@"  ruta: %@", p ?: @"(sin ruta)"]];
    if (p) {
        if (hasLease) [self log:[NSString stringWithFormat:@"  lease: %d", hasLease(p)]];
        [self listar:p];
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
