import { ConflictException, NotFoundException } from '@nestjs/common';

export const ACTION_FAILURE_REASON = {
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_IN_USE: 'EMAIL_ALREADY_IN_USE',
} as const;

export type ActionResultOk<T> = {
  ok: true;
  data: T;
};

export type ActionResultError<R> = {
  ok: false;
  reason: R;
};

export type ActionResult<T, R = keyof typeof ACTION_FAILURE_REASON> =
  | ActionResultOk<T>
  | ActionResultError<R>;

export const actionResult = {
  ok: <T>(data: T): ActionResult<T> => ({
    ok: true,
    data,
  }),
  error: <R extends keyof typeof ACTION_FAILURE_REASON>(
    reason: R,
  ): ActionResult<never, R> => ({
    ok: false,
    reason,
  }),
};

export const ACTION_FAILURE_REASON_MAP: Record<
  keyof typeof ACTION_FAILURE_REASON,
  () => Error
> = {
  [ACTION_FAILURE_REASON.USER_ALREADY_EXISTS]: () =>
    new ConflictException('User already exists'),
  [ACTION_FAILURE_REASON.USER_NOT_FOUND]: () =>
    new NotFoundException('User not found'),
  [ACTION_FAILURE_REASON.EMAIL_ALREADY_IN_USE]: () =>
    new ConflictException('Email already in use'),
};

export const unwrapActionResult = <T>(result: ActionResult<T>) => {
  if (result.ok) return result.data;
  throw ACTION_FAILURE_REASON_MAP[result.reason]();
};
