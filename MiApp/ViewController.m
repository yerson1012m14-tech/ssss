#import "ViewController.h"
#import <mach-o/dyld.h>
#import <objc/runtime.h>

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

    UIButton *btn1 = [self boton:@"1. Ver mi sandbox" accion:@selector(verSandbox)];
    UIButton *btn2 = [self boton:@"2. Probar acceso" accion:@selector(probarMotor)];
    UIButton *btn3 = [self boton:@"3. Diagnostico" accion:@selector(diagnostico)];
    UIButton *btn4 = [self boton:@"4. Escanear motor" accion:@selector(escanearMotor)];

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

    [self log:@"App V4 iniciada."];
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
    [self log:@"--- Probar acceso ---"];
    [self listar:@"/private/var/mobile/Containers/Data/Application"];
}

- (void)diagnostico {
    [self log:@"--- Diagnostico ---"];
    uint32_t n = _dyld_image_count();
    for (uint32_t i = 0; i < n; i++) {
        NSString *name = [NSString stringWithUTF8String:_dyld_get_image_name(i)];
        if ([name containsString:@".app/"]) [self log:[NSString stringWithFormat:@"Cargada: %@", name.lastPathComponent]];
    }
}

- (void)escanearMotor {
    [self log:@"--- Clases del motor en memoria ---"];
    int count = objc_getClassList(NULL, 0);
    Class *classes = (Class *)malloc(sizeof(Class) * count);
    objc_getClassList(classes, count);
    int encontrados = 0;

    for (int i = 0; i < count; i++) {
        NSString *name = NSStringFromClass(classes[i]);
        if ([name containsString:@"MCM"] || [name containsString:@"Filza"] ||
            [name containsString:@"Sandbox"] || [name containsString:@"Poster"] ||
            [name containsString:@"Bridge"]) {
            encontrados++;
            [self log:[NSString stringWithFormat:@"CLASE: %@", name]];

            unsigned int mcount = 0;
            Method *methods = class_copyMethodList(classes[i], &mcount);
            for (unsigned int m = 0; m < mcount; m++) {
                [self log:[NSString stringWithFormat:@"   - %@", NSStringFromSelector(method_getName(methods[m]))]];
            }
            free(methods);

            unsigned int ccount = 0;
            Method *cmethods = class_copyMethodList(object_getClass(classes[i]), &ccount);
            for (unsigned int m = 0; m < ccount; m++) {
                NSString *sel = NSStringFromSelector(method_getName(cmethods[m]));
                if (![sel hasPrefix:@"load"] && ![sel hasPrefix:@"initialize"]) {
                    [self log:[NSString stringWithFormat:@"   + %@", sel]];
                }
            }
            free(cmethods);
        }
    }
    free(classes);
    if (!encontrados) [self log:@"(ninguna clase del motor encontrada)"];
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
