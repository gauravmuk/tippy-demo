const store = {};

window.addEventListener("DOMContentLoaded", () => {
  tippy("a[data-ctxt=true]", {
    content: `Loading...`,
    allowHTML: true,
    onHidden(instance) {
      instance.setContent(`Loading...`);
    },
    async onShow(instance) {
      const contextUrl = `https://cors-anywhere.herokuapp.com/${instance.reference.href}`;
      let response;

      store[contextUrl] = store[contextUrl] || {};
      if (!store[contextUrl].data) {
        const data = await fetch(contextUrl);
        response = await data.text();
        store[contextUrl].data = response;
      } else {
        response = store[contextUrl].data;
      }

      const html = $(response);

      if (!store[contextUrl].title) {
        store[contextUrl].title = html
          .filter(`meta[property='og:title']`)
          .attr(`content`);
      }

      if (!store[contextUrl].description) {
        store[contextUrl].description = html
          .filter(`meta[property='og:description']`)
          .attr(`content`);
      }

      if (!store[contextUrl].imageUrl) {
        store[contextUrl].imageUrl = html
          .filter(`meta[property='og:image']`)
          .attr(`content`);
      }
      const image = new Image();
      image.src = store[contextUrl].imageUrl;
      image.onload = () => {
        instance.setContent(`<img width=100% src=${store[contextUrl].imageUrl}>
          <p class="ctxt-title">${store[contextUrl].title}</p>
          <p class="ctxt-description">${store[contextUrl].description}</p>`);
      };
    },
  });
});
