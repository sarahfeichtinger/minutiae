import { Controller, Get, Request, Post, UseGuards, Res, Param, Delete } from "@nestjs/common";
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './auth/constants';
import { Response } from 'express';
import { LogsService } from "./logs/logs.service";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Controller('auth')
export class AppController {
  constructor(private authService: AuthService, private readonly logsService: LogsService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res({ passthrough: true }) response: Response, @Request() req) {
    const access = await this.authService.login(req.user);
    const refresh_token = await this.authService.getRefreshToken(req.user);

    response.cookie('ACCESS_TOKEN_COOKIE', access.token, {
      httpOnly: true,
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), //TODO
    });

    response.cookie('REFRESH_TOKEN_COOKIE', refresh_token, {
      httpOnly: true,
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });

    await this.logsService.createConfigLog(
      {
        action: 'LOGIN',
        modifiedTable: 'USER',
        newValue: 'NONE',
        oldValue: 'NONE',
      },
      req.user,
    );

    return { userId: access.userId };
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('ACCESS_TOKEN_COOKIE', {
      expires: Date.now(),
    });

    return { logout: true };
  }

  /*@Get('refresh')
  @UseGuards(AuthGuard('refresh'))
  async regenerateTokens(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.getJwtToken(req.user);
    const refreshToken = await this.authService.getRefreshToken(
      req.user.userId,
    );
    const secretData = {
      token,
      refreshToken,
    };

    res.cookie('auth-cookie', secretData, { httpOnly: true });
    return { msg: 'success' };
  }*/
}
