/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)/login` | `/(auth)/register` | `/(auth)/reset` | `/(auth)/reset-password` | `/(auth)/verify` | `/(pages)/account` | `/(pages)/chatRoom` | `/(pages)/chatScreen` | `/(pages)/update-profile` | `/(product)/add` | `/(tabs)` | `/(tabs)/` | `/(tabs)/payment` | `/(tabs)/profile` | `/(tabs)/sell` | `/_sitemap` | `/account` | `/add` | `/chatRoom` | `/chatScreen` | `/login` | `/onBoarding` | `/payment` | `/profile` | `/register` | `/reset` | `/reset-password` | `/search/catagory` | `/sell` | `/update-profile` | `/verify`;
      DynamicRoutes: `/${Router.SingleRoutePart<T>}` | `/(product)/${Router.SingleRoutePart<T>}` | `/search/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(product)/[product]` | `/[product]` | `/search/[search]`;
    }
  }
}
