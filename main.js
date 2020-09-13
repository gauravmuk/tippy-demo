const store = {};

window.addEventListener("DOMContentLoaded", () => {
  tippy("a[data-ctxt=true]", {
    content: `Loading...`,
    allowHTML: true,
    onHidden(instance) {
      instance.setContent(`Loading...`);
    },
    async onShow(instance) {
      const contextUrl = `.netlify/functions/cors?website=${instance.reference.href}`;
      let response;

      if (!store[contextUrl]) {
        store[contextUrl] = store[contextUrl] || {};
        const data = await fetch(contextUrl);
        response = await data.text();
        response = JSON.parse(response).data;
        store[contextUrl] = response;
      } else {
        response = store[contextUrl];
      }

      if (!store[contextUrl].title) {
        store[contextUrl].title = response.title;
      }

      if (!store[contextUrl].description) {
        store[contextUrl].description = response.description;
      }

      if (!store[contextUrl].imageUrl) {
        store[contextUrl].imageUrl = response.imageUrl;
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
