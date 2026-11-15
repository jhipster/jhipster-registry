/**
 * Problem details defined in RFC 7807.
 * @see https://datatracker.ietf.org/doc/html/rfc7807#section-3.1
 */
export type ProblemDetails = {
  /** A URI reference that identifies the problem type */
  type: string;
  /** A short, human-readable summary of the problem type */
  title: string;
  /** The HTTP status code */
  status: number;
  /** A human-readable explanation specific to this occurrence of the problem */
  detail: string;
  /** A URI reference that identifies the specific occurrence of the problem */
  instance: string;
};

export const ProblemWithMessageType = 'https://www.jhipster.tech/problem/problem-with-message';

export type FieldErrorVM = { message: string; objectName: string; field: string };

export type ProblemWithMessage = ProblemDetails & {
  type: typeof ProblemWithMessageType;

  /** Translation message key */
  message?: string;
  /** Translation message parameter */
  params?: string;
  /** Request path */
  path?: string;
  /** Field errors */
  fieldErrors?: FieldErrorVM[];
};

export const isProblemWithMessage = (data: any): data is ProblemWithMessage => data?.type === ProblemWithMessageType;
