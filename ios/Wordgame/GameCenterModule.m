#import <Foundation/Foundation.h>
#import <GameKit/GameKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>

@interface GameCenterModule : NSObject <RCTBridgeModule>
@property (nonatomic, copy) RCTPromiseResolveBlock pendingResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock pendingReject;
@end

@implementation GameCenterModule

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (NSDictionary *)serializePlayer:(GKPlayer *)player
{
  return @{
    @"gamePlayerId": player.gamePlayerID ?: @"",
    @"teamPlayerId": player.teamPlayerID ?: @"",
    @"displayName": player.displayName ?: @"",
    @"alias": player.alias ?: @""
  };
}

- (NSString *)authorizationStatusString:(NSInteger)status
{
  if (@available(iOS 14.5, *)) {
    switch ((GKFriendsAuthorizationStatus)status) {
      case GKFriendsAuthorizationStatusAuthorized:
        return @"authorized";
      case GKFriendsAuthorizationStatusDenied:
        return @"denied";
      case GKFriendsAuthorizationStatusRestricted:
        return @"restricted";
      case GKFriendsAuthorizationStatusNotDetermined:
      default:
        return @"not_determined";
    }
  }

  return @"unsupported";
}

RCT_REMAP_METHOD(isAvailable,
                 isAvailableWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@YES);
}

RCT_REMAP_METHOD(authenticate,
                 authenticateWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  GKLocalPlayer *localPlayer = GKLocalPlayer.localPlayer;
  self.pendingResolve = resolve;
  self.pendingReject = reject;

  __weak typeof(self) weakSelf = self;
  localPlayer.authenticateHandler = ^(UIViewController *viewController, NSError *error) {
    __strong typeof(self) strongSelf = weakSelf;
    if (!strongSelf) {
      return;
    }

    if (error) {
      if (strongSelf.pendingReject) {
        strongSelf.pendingReject(@"game_center_auth", error.localizedDescription, error);
      }
      strongSelf.pendingResolve = nil;
      strongSelf.pendingReject = nil;
      return;
    }

    if (viewController) {
      UIViewController *presenter = RCTPresentedViewController();
      if (presenter) {
        [presenter presentViewController:viewController animated:YES completion:nil];
      } else if (strongSelf.pendingReject) {
        strongSelf.pendingReject(@"game_center_auth", @"No view controller available for Game Center authentication.", nil);
        strongSelf.pendingResolve = nil;
        strongSelf.pendingReject = nil;
      }
      return;
    }

    if (!GKLocalPlayer.localPlayer.isAuthenticated) {
      return;
    }

    if (strongSelf.pendingResolve) {
      strongSelf.pendingResolve([strongSelf serializePlayer:GKLocalPlayer.localPlayer]);
    }
    strongSelf.pendingResolve = nil;
    strongSelf.pendingReject = nil;
  };
}

RCT_REMAP_METHOD(getLocalPlayer,
                 getLocalPlayerWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  GKLocalPlayer *localPlayer = GKLocalPlayer.localPlayer;
  if (!localPlayer.isAuthenticated) {
    reject(@"game_center_not_authenticated", @"Game Center player is not authenticated.", nil);
    return;
  }

  resolve([self serializePlayer:localPlayer]);
}

RCT_REMAP_METHOD(loadFriends,
                 loadFriendsWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  GKLocalPlayer *localPlayer = GKLocalPlayer.localPlayer;
  if (!localPlayer.isAuthenticated) {
    reject(@"game_center_not_authenticated", @"Authenticate with Game Center before loading friends.", nil);
    return;
  }

  if (@available(iOS 14.5, *)) {
    [localPlayer loadFriendsAuthorizationStatus:^(GKFriendsAuthorizationStatus status, NSError *statusError) {
      if (statusError) {
        reject(@"game_center_friends_status", statusError.localizedDescription, statusError);
        return;
      }

      [localPlayer loadFriends:^(NSArray<GKPlayer *> *friends, NSError *friendsError) {
        if (friendsError) {
          reject(@"game_center_friends", friendsError.localizedDescription, friendsError);
          return;
        }

        NSMutableArray *items = [NSMutableArray array];
        for (GKPlayer *friendPlayer in friends) {
          NSMutableDictionary *entry = [[self serializePlayer:friendPlayer] mutableCopy];
          entry[@"authorizationStatus"] = [self authorizationStatusString:status];
          [items addObject:entry];
        }

        resolve(@{
          @"authorizationStatus": [self authorizationStatusString:status],
          @"friends": items
        });
      }];
    }];
    return;
  }

  reject(@"game_center_unsupported", @"Game Center friends require iOS 14.5 or newer.", nil);
}

@end
