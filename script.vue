<!--

CodePen Camera
==========

A Progressive Web App Camera built using Vue, Tailwind, and WebRTC. Try adding the Debug view to your home screen and read the companion blog to learn more:

[Blog](https://medium.com/@leemartin/how-to-build-a-simple-ios-home-screen-pwa-camera-using-vue-tailwind-and-webrtc-on-codepen-2d61a9754d47?source=friends_link&sk=2ed90bf1e4f52db8491636cebb4b582b)

-->

<template>
  <main ontouchstart="" class="md:text-xl lg:text-2xl">
    <!-- Intro -->
    <!-- ---------- -->
    <!-- Inform the user of the camera's purpose and prepare them for camera permissions. -->
    <section
      id="intro"
      v-if="!stream"
      class="absolute flex flex-col inset-0 px-4 py-8 z-20"
    >
      <article class="flex flex-1 flex-col items-center justify-center">
        <img
          src="https://assets.codepen.io/141041/Button-Fill-Black-Large.png"
          alt="CodePen"
          class="h-32 md:h-40 lg:h-64 mb-4 w-32 md:w-40 lg:w-64"
        />
        <h1 class="font-bold mb-4 text-2xl md:text-3xl lg:text-5xl text-center">
          CodePen Camera
        </h1>
        <p
          class="leading-relaxed md:max-w-screen-sm lg:max-w-screen-md text-center"
        >
          This is a Progressive Web App Camera built on CodePen using
          <a href="https://vuejs.org/" target="_blank" class="underline">Vue</a>
          ,
          <a href="https://tailwindcss.com/" target="_blank" class="underline">
            Tailwind
          </a>
          , and
          <a href="http://webrtc.org/" target="_blank" class="underline">
            WebRTC
          </a>
          . Try adding the Debug view to your home screen and read the companion
          <a
            href="https://medium.com/@leemartin/how-to-build-a-simple-ios-home-screen-pwa-camera-using-vue-tailwind-and-webrtc-on-codepen-2d61a9754d47?source=friends_link&sk=2ed90bf1e4f52db8491636cebb4b582b"
            target="_blank"
            class="underline"
          >
            blog
          </a>
          to learn more.
        </p>
      </article>

      <footer class="text-center">
        <button
          @click="startCamera"
          class="bg-black font-bold px-4 py-2 rounded-md text-white"
        >
          Allow Access
        </button>
      </footer>
    </section>

    <!-- Camera -->
    <!-- ---------- -->
    <!-- Allow the user to capture photos and take other camera actions. -->
    <section
      id="camera"
      v-if="stream"
      class="absolute flex flex-col inset-0 items-center justify-end px-4 py-8 z-20"
    >
      <footer>
        <button class="capture" @click="capturePhoto">
          <img
            src="https://assets.codepen.io/141041/Button-Fill-White-Large.png"
            alt="CodePen"
            class="h-24 w-24"
            :disabled="!ready"
          />
        </button>
      </footer>
    </section>

    <!-- Download -->
    <!-- ---------- -->
    <!-- Allow the user to preview and download the captured photo or return to camera. -->
    <section
      id="download"
      v-if="photo"
      class="absolute bg-white flex flex-col inset-0 items-center justify-between px-4 py-8 z-30"
    >
      <header>
        <button @click="photo = null">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            class="h-10 md:h-12 lg:h-16 w-10 lg:w-12 md:w-16"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </header>

      <article>
        <img
          :src="photo.toDataURL('image/jpeg')"
          alt="Photo"
          class="h-64 w-64"
        />
      </article>

      <footer>
        <button @click="downloadPhoto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            class="h-10 md:h-12 lg:h-16 w-10 lg:w-12 md:w-16"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
            />
          </svg>
        </button>
      </footer>
    </section>

    <!-- Video -->
    <!-- ---------- -->
    <video
      ref="video"
      class="absolute h-full inset-0 object-cover w-full z-10"
      autoplay
      muted
      playsinline
    ></video>
  </main>
</template>

<script>
export default {
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
</script>

<style>
html,
body,
main,
section {
  height: 100%;
  width: 100%;
}

html {
  position: fixed;
}

body {
  font-family: "Lato", sans-serif;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}

button.capture:disabled {
  opacity: 0.25;
}

button.capture:active {
  opacity: 0.9;
}
</style>
