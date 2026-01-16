import posthog from 'posthog-js';

const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    autocapture: false,
    capture_pageview: false
  });
}

export const capturePageview = (path: string) => {
  if (!posthogKey) return;
  posthog.capture('$pageview', {
    $current_url: `${window.location.origin}${path}`
  });
};

export default posthog;
