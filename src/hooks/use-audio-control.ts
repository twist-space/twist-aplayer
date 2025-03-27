import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';

type CreateAudioElementOptions = {
  initialVolume?: number;
  mutex?: boolean;
} & Pick<
  React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  >,
  'src' | 'autoPlay' | 'onEnded' | 'onError'
>;

const instances: HTMLAudioElement[] = [];

function useCreateAudioElement(options?: CreateAudioElementOptions) {
  const audioElementRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioElementRef.current) {
      const audio = (audioElementRef.current = document.createElement('audio'));

      if (typeof options?.src !== 'undefined') {
        audio.src = options.src;
      }

      if (typeof options?.autoPlay !== 'undefined') {
        audio.autoplay = options.autoPlay;
      }

      if (typeof options?.initialVolume !== 'undefined') {
        audio.volume = options.initialVolume;
      }

      if (!instances.includes(audio)) {
        instances.push(audio);
      }
    }
  }, [options?.autoPlay, options?.initialVolume, options?.src]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = audioElementRef.current;

    if (audio && options?.onError) {
      // @ts-expect-error nothing
      audio.addEventListener('error', options.onError);

      return () => {
      // @ts-expect-error nothing
        audio.removeEventListener('error', options.onError);
      };
    }
  }, [options?.onError]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const audio = audioElementRef.current;

    if (audio && options?.onEnded) {
      // @ts-expect-error nothing
      audio.addEventListener('ended', options.onEnded);

      return () => {
      // @ts-expect-error nothing
        audio.removeEventListener('ended', options.onEnded);
      };
    }
  }, [options?.onEnded]);

  useEffect(() => {
    return () => {
      const audio = audioElementRef.current;
      // Properly stop the <audio> playing
      // https://stackoverflow.com/a/14836099/6840562
      if (audio) {
        audio.pause();
        audio.currentTime = 0;

        // destory current instance
        const index = instances.indexOf(audio);

        if (index !== -1) {
          instances.splice(index, 1);
        }
      }
      audioElementRef.current = undefined;
    };
  }, []);

  return audioElementRef;
}

export function useAudioControl(options: CreateAudioElementOptions) {
  const audioElementRef = useCreateAudioElement(options);

  const pauseOtherInstance = useCallback((audio: HTMLAudioElement) => {
    for (let i = 0; i < instances.length; i++) {
      const instance = instances[i];

      if (instance !== audio && !instance.paused) {
        instance.pause();
      }
    }
  }, []);

  const playAudio = useCallback(
    async (src: string) => {
      const audio = audioElementRef.current;
      if (audio) {
        if (options.mutex) {
          pauseOtherInstance(audio);
        }

        if (audio.src !== src) {
          audio.pause();
          audio.currentTime = 0;
          audio.src = src;
        }
        try {
          await audioElementRef.current?.play();
        } catch {
          // nothing
        }
      }
    },
    [audioElementRef, options.mutex, pauseOtherInstance],
  );

  const togglePlay = useCallback(
    (src: string) => {
      const audio = audioElementRef.current;
      if (!audio) return;

      if (audio.paused) {
        playAudio(src);
      } else {
        audio.pause();
      }
    },
    [audioElementRef, playAudio],
  );

  const seek = useCallback(
    (second: number) => {
      (audioElementRef.current as HTMLAudioElement).currentTime = second;
    },
    [audioElementRef],
  );

  const toggleMuted = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.muted = !audioElementRef.current.muted;
    }
  }, [audioElementRef]);

  const setVolume = useCallback(
    (value: number) => {
      if (audioElementRef.current) {
        audioElementRef.current.volume = value;
      }
    },
    [audioElementRef],
  );

  const volume = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener(
          'volumechange',
          onStoreChange,
        );

        return () => {
          audioElementRef.current?.removeEventListener(
            'volumechange',
            onStoreChange,
          );
        };
      },
      [audioElementRef],
    ),
    () => audioElementRef.current?.volume,
    () => undefined,
  );

  const muted = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener(
          'volumechange',
          onStoreChange,
        );

        return () => {
          audioElementRef.current?.removeEventListener(
            'volumechange',
            onStoreChange,
          );
        };
      },
      [audioElementRef],
    ),
    () => audioElementRef.current?.muted,
    () => undefined,
  );

  const currentTime = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener('timeupdate', onStoreChange);

        return () => {
          audioElementRef.current?.removeEventListener(
            'timeupdate',
            onStoreChange,
          );
        };
      },
      [audioElementRef],
    ),
    () => {
      if (!audioElementRef.current) {
        return undefined;
      }

      // Use `Math.round()` here because
      //   1. The player UI only displays currentTime at second-level precision
      //   2. Prevent too many updates (leads to crash on Safari)
      return Math.round(audioElementRef.current.currentTime);
    },
    () => undefined,
  );

  const duration = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener(
          'durationchange',
          onStoreChange,
        );

        return () => {
          audioElementRef.current?.removeEventListener(
            'durationchange',
            onStoreChange,
          );
        };
      },
      [audioElementRef],
    ),
    () => audioElementRef.current?.duration,
    () => undefined,
  );

  const bufferedSeconds = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener('progress', onStoreChange);

        return () => {
          audioElementRef.current?.removeEventListener(
            'progress',
            onStoreChange,
          );
        };
      },
      [audioElementRef],
    ),
    () => {
      const audio = audioElementRef.current;

      if (!audio) return 0;

      if (audio.buffered.length > 0) {
        return audio.buffered.end(audio.buffered.length - 1);
      }
      return 0;
    },
    () => undefined,
  );

  const isPlaying = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener('play', onStoreChange);
        audioElementRef.current?.addEventListener('pause', onStoreChange);

        return () => {
          audioElementRef.current?.removeEventListener('play', onStoreChange);
          audioElementRef.current?.removeEventListener('pause', onStoreChange);
        };
      },
      [audioElementRef],
    ),
    () => {
      const audio = audioElementRef.current;
      return audio ? !audio.paused : false;
    },
    () => undefined,
  );

  const isLoading = useSyncExternalStore(
    useCallback(
      (onStoreChange: () => void) => {
        audioElementRef.current?.addEventListener('playing', onStoreChange);
        audioElementRef.current?.addEventListener('waiting', onStoreChange);

        return () => {
          audioElementRef.current?.removeEventListener(
            'playing',
            onStoreChange,
          );
          audioElementRef.current?.removeEventListener(
            'waiting',
            onStoreChange,
          );
        };
      },
      [audioElementRef],
    ),
    () => {
      const audio = audioElementRef.current;
      if (!audio) return false;
      return audio.networkState === audio.NETWORK_LOADING;
    },
    () => undefined,
  );

  return {
    playAudio,
    togglePlay,
    seek,
    toggleMuted,
    setVolume,
    volume,
    muted,
    currentTime,
    duration,
    bufferedSeconds,
    isPlaying,
    isLoading,
  };
}
