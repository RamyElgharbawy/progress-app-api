import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  id: string;
  userName: string;
  isActive: boolean;
}
/**
 * Current User Decorator
 * Extracts the authenticated user from the request
 *
 * Usage:
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile(@CurrentUser() user: { id: string; userName: string }) {
 *   return user;
 * }
 */
// export const CurrentUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user;
//   },
// );
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: AuthenticatedUser }>();
    return request.user;
  },
);
