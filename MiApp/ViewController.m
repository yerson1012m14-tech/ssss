#import "ViewController.h"
#import <mach-o/dyld.h>
#import <mach-o/loader.h>
#import <mach-o/nlist.h>
#import <string.h>
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
    UIButton *btn2 = [self boton:@"2. Funciones del motor" accion:@selector(verSimbolos)];
    UIButton *btn3 = [self boton:@"3. Diagnostico" accion:@selector(diagnostico)];

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
        [self.logView.topAnchor constraintEqualToAnchor:btn3.bottomAnchor constant:8],
        [self.logView.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor constant:10],
        [self.logView.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor constant:-10],
        [self.logView.bottomAnchor constraintEqualToAnchor:self.view.safeAreaLayoutGuide.bottomAnchor constant:-10]
    ]];

    [self log:@"App V5 iniciada."];
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

- (void)diagnostico {
    [self log:@"--- Diagnostico ---"];
    uint32_t n = _dyld_image_count();
    for (uint32_t i = 0; i < n; i++) {
        NSString *name = [NSString stringWithUTF8String:_dyld_get_image_name(i)];
        if ([name containsString:@".app/"]) [self log:[NSString stringWithFormat:@"Cargada: %@", name.lastPathComponent]];
    }
}

- (void)verSimbolos {
    [self log:@"--- Funciones del motor ---"];
    for (uint32_t i = 0; i < _dyld_image_count(); i++) {
        const char *iname = _dyld_get_image_name(i);
        if (!strstr(iname, "FilzaApplySandboxExt")) continue;

        const struct mach_header_64 *h = (const struct mach_header_64 *)_dyld_get_image_header(i);
        intptr_t slide = _dyld_get_image_vmaddr_slide(i);
        const struct symtab_command *sym = NULL;
        const struct segment_command_64 *le = NULL;
        const struct load_command *lc = (const struct load_command *)((const uint8_t *)h + sizeof(struct mach_header_64));

        for (uint32_t c = 0; c < h->ncmds; c++) {
            if (lc->cmd == LC_SYMTAB) sym = (const struct symtab_command *)lc;
            else if (lc->cmd == LC_SEGMENT_64) {
                const struct segment_command_64 *sg = (const struct segment_command_64 *)lc;
                if (strcmp(sg->segname, "__LINKEDIT") == 0) le = sg;
            }
            lc = (const struct load_command *)((const uint8_t *)lc + lc->cmdsize);
        }
        if (!sym || !le) { [self log:@"(sin tabla de simbolos)"]; return; }

        uintptr_t base = (uintptr_t)(le->vmaddr + slide - le->fileoff);
        const struct nlist_64 *nl = (const struct nlist_64 *)(base + sym->symoff);
        const char *str = (const char *)(base + sym->stroff);

        int mostrados = 0;
        for (uint32_t s = 0; s < sym->nsyms; s++) {
            if ((nl[s].n_type & N_TYPE) == N_SECT && nl[s].n_value != 0) {
                const char *name = str + nl[s].n_un.n_strx;
                if (name[0] != '_') continue;
                [self log:[NSString stringWithUTF8String:name]];
                if (++mostrados > 250) { [self log:@"... (truncado)"]; break; }
            }
        }
    }
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
