import type {
  FetcherResult,
  FetcherReturnType,
  Observable,
} from '@graphiql/toolkit';

// Utilities for fetcher, source:
// https://github.com/graphql/graphiql/blob/08250feb6ee8335c3b1ca83a912911ae92a75722/packages/graphiql/src/components/GraphiQL.tsx#L2050

// Duck-type Observable.take(1).toPromise()
function observableToPromise<T>(observable: Observable<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const subscription = observable.subscribe({
      next: (v) => {
        resolve(v);
        subscription.unsubscribe();
      },
      error: reject,
      complete: () => {
        reject(new Error('no value resolved'));
      },
    });
  });
}

// Duck-type observable detection.
function isObservable<T>(value: any): value is Observable<T> {
  return (
    typeof value === 'object' &&
    'subscribe' in value &&
    typeof value.subscribe === 'function'
  );
}

function isAsyncIterable(input: unknown): input is AsyncIterable<unknown> {
  return (
    typeof input === 'object' &&
    input !== null &&
    // Some browsers still don't have Symbol.asyncIterator implemented (iOS Safari)
    // That means every custom AsyncIterable must be built using a AsyncGeneratorFunction (async function * () {})
    ((input as any)[Symbol.toStringTag] === 'AsyncGenerator' ||
      Symbol.asyncIterator in input)
  );
}

function asyncIterableToPromise<T>(
  input: AsyncIterable<T> | AsyncIterableIterator<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Also support AsyncGenerator on Safari iOS.
    // As mentioned in the isAsyncIterable function there is no Symbol.asyncIterator available
    // so every AsyncIterable must be implemented using AsyncGenerator.
    const iteratorReturn = (
      'return' in input ? input : input[Symbol.asyncIterator]()
    ).return?.bind(input);
    const iteratorNext = (
      'next' in input ? input : input[Symbol.asyncIterator]()
    ).next.bind(input);

    iteratorNext()
      .then((result) => {
        resolve(result.value);
        // ensure cleanup
        iteratorReturn?.();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function fetcherReturnToPromise(
  fetcherResult: FetcherReturnType
): Promise<FetcherResult> {
  return Promise.resolve(fetcherResult).then((fetcherResult) => {
    if (isAsyncIterable(fetcherResult)) {
      return asyncIterableToPromise(fetcherResult);
    } else if (isObservable(fetcherResult)) {
      return observableToPromise(fetcherResult);
    }
    return fetcherResult;
  });
}
