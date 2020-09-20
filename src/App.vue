<template>
  <div id="app">
    <transition>
      <router-view/>
    </transition>
  </div>
</template>

<style>
  /* fade in left */
  .fade-left-enter {
    transform: translate(100px, 0);
    opacity: 0;
  }
  .fade-left-enter-to {
    opacity: 1;
  }
  .fade-left-enter-active {
    transition: all 1s 0s ease;
  }
  .fade-left-leave {
    transform: translate(0, 0);
    opacity: 1;
  }
  .fade-left-leave-to {
    transform: translate(-100px, 0);
    opacity: 0;
  }
  .fade-left-leave-active {
    transition: all .5s 0s ease;
  }


  /* fade in right */
  .fade-right-enter {
    transform: translate(-100px, 0);
    opacity: 0;
  }
  .fade-right-enter-to {
    opacity: 1;
  }
  .fade-right-enter-active {
    transition: all 1s 0s ease;
  }
  .fade-right-leave {
    transform: translate(0, 0);
    opacity: 1;
  }
  .fade-right-leave-to {
    transform: translate(100px, 0);
    opacity: 0;
  }
  .fade-right-leave-active {
    transition: all .5s 0s ease;
  }


  /* fade in */
  .fade-in-enter {
    opacity: 0;
  }
  .fade-in-enter-to {
    opacity: 1;
  }
  .fade-in-enter-active {
    transition: all 1s 0s ease;
  }
  .fade-in-leave {
    opacity: 1;
  }
  .fade-in-leave-to {
    opacity: 0;
  }
  .fade-in-leave-active {
    transition: all .5s 0s ease;
  }


  /* fade in top */
  .fade-in-top-enter {
    transform: translate(0, -1px);
    opacity: 0;
  }
  .fade-in-top-enter-to {
    opacity: 1;
  }
  .fade-in-top-enter-active {
    transition: all 0.5s 0s ease;
  }
  .fade-in-top-leave {
    transform: translate(0, 0);
    opacity: 1;
  }
  .fade-in-top-leave-to {
    transform: translate(0, -1px);
    opacity: 0;
  }
  .fade-in-top-leave-active {
    transition: all .5s 0s ease;
  }


</style>
