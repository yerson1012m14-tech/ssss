#import <Foundation/Foundation.h>

@interface Motor : NSObject
+ (void)encender;
+ (NSString *)rutaDeApp:(NSString *)bundleId;
+ (NSArray<NSString *> *)appsInstaladas;
+ (NSString *)tamanoDeApp:(NSString *)bundleId;
@end
