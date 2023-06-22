function showCheckoutWindow(e) {
  e.preventDefault();

  const url = e.target?.href;
  const title = 'Square Online Checkout';

  // Some platforms embed in an iframe, so we want to top window to calculate sizes correctly
  const topWindow = window.top ? window.top : window;

  // Fixes dual-screen position                                Most browsers          Firefox
  const dualScreenLeft = topWindow.screenLeft !== undefined ? topWindow.screenLeft : topWindow.screenX;
  const dualScreenTop = topWindow.screenTop !== undefined ? topWindow.screenTop : topWindow.screenY;

  const width = topWindow.innerWidth ? topWindow.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const height = topWindow.innerHeight ? topWindow.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const h = height * .75;
  const w = 500;

  const systemZoom = width / topWindow.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(url, title, `scrollbars=yes, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}`);

  if (window.focus) newWindow.focus();
}

// This overrides the default checkout button click handler to show the embed modal
// instead of opening a new tab with the given link url
document.addEventListener('click', function (e) {
  const url = e.target?.href
  if (url.startsWith('https://square.link/u/') && url.endsWith('?src=embed'))
    showCheckoutWindow(e);
});