#import "Motor.h"
#import <dlfcn.h>

@implementation Motor

+ (void)encender {
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

+ (NSString *)rutaDeApp:(NSString *)bundleId {
    [self encender];
    NSString *(*dataPath)(NSString *) = dlsym(RTLD_DEFAULT, "MCMFilzaDataContainerPath");
    if (!dataPath) return nil;
    NSString *p = nil;
    @try { p = dataPath(bundleId); } @catch (NSException *e) { p = nil; }
    return p;
}

+ (NSArray<NSString *> *)appsInstaladas {
    NSMutableArray *out = [NSMutableArray new];
    @try {
        Class ws = NSClassFromString(@"LSApplicationWorkspace");
        if (ws && [ws respondsToSelector:@selector(defaultWorkspace)]) {
            id workspace = [ws performSelector:@selector(defaultWorkspace)];
            if (workspace && [workspace respondsToSelector:@selector(allApplications)]) {
                NSArray *all = [workspace performSelector:@selector(allApplications)];
                for (id proxy in all) {
                    @try {
                        if ([proxy respondsToSelector:@selector(applicationIdentifier)]) {
                            NSString *bid = [proxy performSelector:@selector(applicationIdentifier)];
                            if (bid && ![bid hasPrefix:@"com.apple."]) [out addObject:bid];
                        }
                    } @catch (NSException *e) {}
                }
            }
        }
    } @catch (NSException *e) {}
    [out sortUsingSelector:@selector(localizedStandardCompare:)];
    return [out copy];
}

+ (NSString *)tamanoDeApp:(NSString *)bundleId {
    NSString *ruta = [self rutaDeApp:bundleId];
    if (!ruta) return @"?";
    unsigned long long total = 0;
    NSFileManager *fm = [NSFileManager defaultManager];
    NSDirectoryEnumerator *enumerator = [fm enumeratorAtPath:ruta];
    NSString *file;
    while ((file = [enumerator nextObject])) {
        NSString *full = [ruta stringByAppendingPathComponent:file];
        NSDictionary *attrs = [fm attributesOfItemAtPath:full error:nil];
        total += [[attrs objectForKey:NSFileSize] unsignedLongLongValue];
    }
    if (total < 1024) return [NSString stringWithFormat:@"%llu B", total];
    if (total < 1024 * 1024) return [NSString stringWithFormat:@"%.1f KB", total / 1024.0];
    if (total < 1024 * 1024 * 1024) return [NSString stringWithFormat:@"%.1f MB", total / (1024.0 * 1024.0)];
    return [NSString stringWithFormat:@"%.2f GB", total / (1024.0 * 1024.0 * 1024.0)];
}

@end
