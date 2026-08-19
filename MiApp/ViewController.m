#import "ViewController.h"

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
    self.logView.font = [UIFont fontWithName:@"Menlo" size:13];
    self.logView.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:self.logView];
    
    UIButton *btn1 = [UIButton buttonWithType:UIButtonTypeSystem];
    [btn1 setTitle:@"1. Ver mi sandbox" forState:UIControlStateNormal];
    [btn1 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    btn1.backgroundColor = [UIColor darkGrayColor];
    btn1.translatesAutoresizingMaskIntoConstraints = NO;
    [btn1 addTarget:self action:@selector(verSandbox) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn1];
    
    UIButton *btn2 = [UIButton buttonWithType:UIButtonTypeSystem];
    [btn2 setTitle:@"2. Probar motor (contenedores)" forState:UIControlStateNormal];
    [btn2 setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    btn2.backgroundColor = [UIColor darkGrayColor];
    btn2.translatesAutoresizingMaskIntoConstraints = NO;
    [btn2 addTarget:self action:@selector(probarMotor) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn2];
    
    [NSLayoutConstraint activateConstraints:@[
        [btn1.topAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor constant:10],
        [btn1.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [btn1.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [btn1.heightAnchor constraintEqualToConstant:44],
        [btn2.topAnchor constraintEqualToAnchor:btn1.bottomAnchor constant:10],
        [btn2.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [btn2.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [btn2.heightAnchor constraintEqualToConstant:44],
        [self.logView.topAnchor constraintEqualToAnchor:btn2.bottomAnchor constant:10],
        [self.logView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [self.logView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [self.logView.bottomAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.bottomAnchor constant:-10]
    ]];
    
    [self log:@"App iniciada. Pulsa los botones para probar."];
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
    if (mcm) {
        [self log:@"[OK] Motor detectado en memoria"];
    } else {
        [self log:@"[!!] Motor NO detectado en memoria"];
    }
    [self listar:@"/private/var/mobile/Containers/Data/Application"];
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
