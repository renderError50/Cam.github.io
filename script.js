var script = {
  data() {
    return {
      stream: null,
      ready: false,
      photo: null
    };
  },
  methods: {
    async startCamera() {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "environment"
        }
      });

      this.$refs.video.srcObject = this.stream;

      this.$refs.video.onloadedmetadata = (e) => {
        this.ready = true;
      };

      this.$refs.video.onended = (e) => {
        this.ready = false;
        this.stream = null;
      };
    },
    capturePhoto() {
      let video = this.$refs.video;

      let videoCanvas = document.createElement("canvas");
      videoCanvas.height = video.videoHeight;
      videoCanvas.width = video.videoWidth;
      let videoContext = videoCanvas.getContext("2d");

      videoContext.drawImage(video, 0, 0);

      this.photo = loadImage.scale(videoCanvas, {
        maxHeight: 1080,
        maxWidth: 1080,
        cover: true,
        crop: true,
        canvas: true
      });
    },
    downloadPhoto() {
      this.photo.toBlob((blob) => {
        let data = window.URL.createObjectURL(blob);
        let link = document.createElement("a");

        link.href = data;
        link.download = "photo.jpg";
        link.click();
      }, "image/jpeg");
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "main",
    { staticClass: "md:text-xl lg:text-2xl", attrs: { ontouchstart: "" } },
    [
      !_vm.stream
        ? _c(
            "section",
            {
              staticClass: "absolute flex flex-col inset-0 px-4 py-8 z-20",
              attrs: { id: "intro" }
            },
            [
              _vm._m(0),
              _vm._v(" "),
              _c("footer", { staticClass: "text-center" }, [
                _c(
                  "button",
                  {
                    staticClass:
                      "bg-black font-bold px-4 py-2 rounded-md text-white",
                    on: { click: _vm.startCamera }
                  },
                  [_vm._v("\n        Allow Access\n      ")]
                )
              ])
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.stream
        ? _c(
            "section",
            {
              staticClass:
                "absolute flex flex-col inset-0 items-center justify-end px-4 py-8 z-20",
              attrs: { id: "camera" }
            },
            [
              _c("footer", [
                _c(
                  "button",
                  { staticClass: "capture", on: { click: _vm.capturePhoto } },
                  [
                    _c("img", {
                      staticClass: "h-24 w-24",
                      attrs: {
                        src:
                          "https://assets.codepen.io/141041/Button-Fill-White-Large.png",
                        alt: "CodePen",
                        disabled: !_vm.ready
                      }
                    })
                  ]
                )
              ])
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.photo
        ? _c(
            "section",
            {
              staticClass:
                "absolute bg-white flex flex-col inset-0 items-center justify-between px-4 py-8 z-30",
              attrs: { id: "download" }
            },
            [
              _c("header", [
                _c(
                  "button",
                  {
                    on: {
                      click: function($event) {
                        _vm.photo = null;
                      }
                    }
                  },
                  [
                    _c(
                      "svg",
                      {
                        staticClass:
                          "h-10 md:h-12 lg:h-16 w-10 lg:w-12 md:w-16",
                        attrs: {
                          xmlns: "http://www.w3.org/2000/svg",
                          height: "24",
                          viewBox: "0 0 24 24",
                          width: "24"
                        }
                      },
                      [
                        _c("path", {
                          attrs: { d: "M0 0h24v24H0z", fill: "none" }
                        }),
                        _vm._v(" "),
                        _c("path", {
                          attrs: {
                            d:
                              "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                          }
                        })
                      ]
                    )
                  ]
                )
              ]),
              _vm._v(" "),
              _c("article", [
                _c("img", {
                  staticClass: "h-64 w-64",
                  attrs: {
                    src: _vm.photo.toDataURL("image/jpeg"),
                    alt: "Photo"
                  }
                })
              ]),
              _vm._v(" "),
              _c("footer", [
                _c("button", { on: { click: _vm.downloadPhoto } }, [
                  _c(
                    "svg",
                    {
                      staticClass: "h-10 md:h-12 lg:h-16 w-10 lg:w-12 md:w-16",
                      attrs: {
                        xmlns: "http://www.w3.org/2000/svg",
                        height: "24",
                        viewBox: "0 0 24 24",
                        width: "24"
                      }
                    },
                    [
                      _c("path", {
                        attrs: { d: "M0 0h24v24H0V0z", fill: "none" }
                      }),
                      _vm._v(" "),
                      _c("path", {
                        attrs: {
                          d:
                            "M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
                        }
                      })
                    ]
                  )
                ])
              ])
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _c("video", {
        ref: "video",
        staticClass: "absolute h-full inset-0 object-cover w-full z-10",
        attrs: { autoplay: "", muted: "", playsinline: "" },
        domProps: { muted: true }
      })
    ]
  )
};
var __vue_staticRenderFns__ = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "article",
      { staticClass: "flex flex-1 flex-col items-center justify-center" },
      [
        _c("img", {
          staticClass: "h-32 md:h-40 lg:h-64 mb-4 w-32 md:w-40 lg:w-64",
          attrs: {
            src: "https://assets.codepen.io/141041/Button-Fill-Black-Large.png",
            alt: "CodePen"
          }
        }),
        _vm._v(" "),
        _c(
          "h1",
          {
            staticClass:
              "font-bold mb-4 text-2xl md:text-3xl lg:text-5xl text-center"
          },
          [_vm._v("\n        CodePen Camera\n      ")]
        ),
        _vm._v(" "),
        _c(
          "p",
          {
            staticClass:
              "leading-relaxed md:max-w-screen-sm lg:max-w-screen-md text-center"
          },
          [
            _vm._v(
              "\n        This is a Progressive Web App Camera built on CodePen using\n        "
            ),
            _c(
              "a",
              {
                staticClass: "underline",
                attrs: { href: "https://vuejs.org/", target: "_blank" }
              },
              [_vm._v("Vue")]
            ),
            _vm._v("\n        ,\n        "),
            _c(
              "a",
              {
                staticClass: "underline",
                attrs: { href: "https://tailwindcss.com/", target: "_blank" }
              },
              [_vm._v("\n          Tailwind\n        ")]
            ),
            _vm._v("\n        , and\n        "),
            _c(
              "a",
              {
                staticClass: "underline",
                attrs: { href: "http://webrtc.org/", target: "_blank" }
              },
              [_vm._v("\n          WebRTC\n        ")]
            ),
            _vm._v(
              "\n        . Try adding the Debug view to your home screen and read the companion\n        "
            ),
            _c(
              "a",
              {
                staticClass: "underline",
                attrs: {
                  href:
                    "https://medium.com/@leemartin/how-to-build-a-simple-ios-home-screen-pwa-camera-using-vue-tailwind-and-webrtc-on-codepen-2d61a9754d47?source=friends_link&sk=2ed90bf1e4f52db8491636cebb4b582b",
                  target: "_blank"
                }
              },
              [_vm._v("\n          blog\n        ")]
            ),
            _vm._v("\n        to learn more.\n      ")
          ]
        )
      ]
    )
  }
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-17019510_0", { source: "\nhtml,\nbody,\nmain,\nsection {\n  height: 100%;\n  width: 100%;\n}\nhtml {\n  position: fixed;\n}\nbody {\n  font-family: \"Lato\", sans-serif;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n}\nbutton.capture:disabled {\n  opacity: 0.25;\n}\nbutton.capture:active {\n  opacity: 0.9;\n}\n", map: {"version":3,"sources":["/tmp/codepen/vuejs/src/pen.vue"],"names":[],"mappings":";AAkNA;;;;EAIA,YAAA;EACA,WAAA;AACA;AAEA;EACA,eAAA;AACA;AAEA;EACA,+BAAA;EACA,wCAAA;EACA,2BAAA;EACA,yBAAA;AACA;AAEA;EACA,aAAA;AACA;AAEA;EACA,YAAA;AACA","file":"pen.vue","sourcesContent":["<!--\n\nCodePen Camera\n==========\n\nA Progressive Web App Camera built using Vue, Tailwind, and WebRTC. Try adding the Debug view to your home screen and read the companion blog to learn more:\n\n[Blog](https://medium.com/@leemartin/how-to-build-a-simple-ios-home-screen-pwa-camera-using-vue-tailwind-and-webrtc-on-codepen-2d61a9754d47?source=friends_link&sk=2ed90bf1e4f52db8491636cebb4b582b)\n\n-->\n\n<template>\n  <main ontouchstart=\"\" class=\"md:text-xl lg:text-2xl\">\n    <!-- Intro -->\n    <!-- ---------- -->\n    <!-- Inform the user of the camera's purpose and prepare them for camera permissions. -->\n    <section\n      id=\"intro\"\n      v-if=\"!stream\"\n      class=\"absolute flex flex-col inset-0 px-4 py-8 z-20\"\n    >\n      <article class=\"flex flex-1 flex-col items-center justify-center\">\n        <img\n          src=\"https://assets.codepen.io/141041/Button-Fill-Black-Large.png\"\n          alt=\"CodePen\"\n          class=\"h-32 md:h-40 lg:h-64 mb-4 w-32 md:w-40 lg:w-64\"\n        />\n        <h1 class=\"font-bold mb-4 text-2xl md:text-3xl lg:text-5xl text-center\">\n          CodePen Camera\n        </h1>\n        <p\n          class=\"leading-relaxed md:max-w-screen-sm lg:max-w-screen-md text-center\"\n        >\n          This is a Progressive Web App Camera built on CodePen using\n          <a href=\"https://vuejs.org/\" target=\"_blank\" class=\"underline\">Vue</a>\n          ,\n          <a href=\"https://tailwindcss.com/\" target=\"_blank\" class=\"underline\">\n            Tailwind\n          </a>\n          , and\n          <a href=\"http://webrtc.org/\" target=\"_blank\" class=\"underline\">\n            WebRTC\n          </a>\n          . Try adding the Debug view to your home screen and read the companion\n          <a\n            href=\"https://medium.com/@leemartin/how-to-build-a-simple-ios-home-screen-pwa-camera-using-vue-tailwind-and-webrtc-on-codepen-2d61a9754d47?source=friends_link&sk=2ed90bf1e4f52db8491636cebb4b582b\"\n            target=\"_blank\"\n            class=\"underline\"\n          >\n            blog\n          </a>\n          to learn more.\n        </p>\n      </article>\n\n      <footer class=\"text-center\">\n        <button\n          @click=\"startCamera\"\n          class=\"bg-black font-bold px-4 py-2 rounded-md text-white\"\n        >\n          Allow Access\n        </button>\n      </footer>\n    </section>\n\n    <!-- Camera -->\n    <!-- ---------- -->\n    <!-- Allow the user to capture photos and take other camera actions. -->\n    <section\n      id=\"camera\"\n      v-if=\"stream\"\n      class=\"absolute flex flex-col inset-0 items-center justify-end px-4 py-8 z-20\"\n    >\n      <footer>\n        <button class=\"capture\" @click=\"capturePhoto\">\n          <img\n            src=\"https://assets.codepen.io/141041/Button-Fill-White-Large.png\"\n            alt=\"CodePen\"\n            class=\"h-24 w-24\"\n            :disabled=\"!ready\"\n          />\n        </button>\n      </footer>\n    </section>\n\n    <!-- Download -->\n    <!-- ---------- -->\n    <!-- Allow the user to preview and download the captured photo or return to camera. -->\n    <section\n      id=\"download\"\n      v-if=\"photo\"\n      class=\"absolute bg-white flex flex-col inset-0 items-center justify-between px-4 py-8 z-30\"\n    >\n      <header>\n        <button @click=\"photo = null\">\n          <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            height=\"24\"\n            viewBox=\"0 0 24 24\"\n            width=\"24\"\n            class=\"h-10 md:h-12 lg:h-16 w-10 lg:w-12 md:w-16\"\n          >\n            <path d=\"M0 0h24v24H0z\" fill=\"none\" />\n            <path\n              d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"\n            />\n          </svg>\n        </button>\n      </header>\n\n      <article>\n        <img\n          :src=\"photo.toDataURL('image/jpeg')\"\n          alt=\"Photo\"\n          class=\"h-64 w-64\"\n        />\n      </article>\n\n      <footer>\n        <button @click=\"downloadPhoto\">\n          <svg\n            xmlns=\"http://www.w3.org/2000/svg\"\n            height=\"24\"\n            viewBox=\"0 0 24 24\"\n            width=\"24\"\n            class=\"h-10 md:h-12 lg:h-16 w-10 lg:w-12 md:w-16\"\n          >\n            <path d=\"M0 0h24v24H0V0z\" fill=\"none\" />\n            <path\n              d=\"M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z\"\n            />\n          </svg>\n        </button>\n      </footer>\n    </section>\n\n    <!-- Video -->\n    <!-- ---------- -->\n    <video\n      ref=\"video\"\n      class=\"absolute h-full inset-0 object-cover w-full z-10\"\n      autoplay\n      muted\n      playsinline\n    ></video>\n  </main>\n</template>\n\n<script>\nexport default {\n  data() {\n    return {\n      stream: null,\n      ready: false,\n      photo: null\n    };\n  },\n  methods: {\n    async startCamera() {\n      this.stream = await navigator.mediaDevices.getUserMedia({\n        audio: false,\n        video: {\n          facingMode: \"environment\"\n        }\n      });\n\n      this.$refs.video.srcObject = this.stream;\n\n      this.$refs.video.onloadedmetadata = (e) => {\n        this.ready = true;\n      };\n\n      this.$refs.video.onended = (e) => {\n        this.ready = false;\n        this.stream = null;\n      };\n    },\n    capturePhoto() {\n      let video = this.$refs.video;\n\n      let videoCanvas = document.createElement(\"canvas\");\n      videoCanvas.height = video.videoHeight;\n      videoCanvas.width = video.videoWidth;\n      let videoContext = videoCanvas.getContext(\"2d\");\n\n      videoContext.drawImage(video, 0, 0);\n\n      this.photo = loadImage.scale(videoCanvas, {\n        maxHeight: 1080,\n        maxWidth: 1080,\n        cover: true,\n        crop: true,\n        canvas: true\n      });\n    },\n    downloadPhoto() {\n      this.photo.toBlob((blob) => {\n        let data = window.URL.createObjectURL(blob);\n        let link = document.createElement(\"a\");\n\n        link.href = data;\n        link.download = \"photo.jpg\";\n        link.click();\n      }, \"image/jpeg\");\n    }\n  }\n};\n</script>\n\n<style>\nhtml,\nbody,\nmain,\nsection {\n  height: 100%;\n  width: 100%;\n}\n\nhtml {\n  position: fixed;\n}\n\nbody {\n  font-family: \"Lato\", sans-serif;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n}\n\nbutton.capture:disabled {\n  opacity: 0.25;\n}\n\nbutton.capture:active {\n  opacity: 0.9;\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export default __vue_component__;