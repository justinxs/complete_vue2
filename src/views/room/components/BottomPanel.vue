<template>
  <div class="bottom-panel">
    <div class="panel-l">
      <div class="panel-btn" @click="$emit('action', 'showEditor')">
        <i class="chat-icon"></i>
      </div>
    </div>
    <div class="panel-r">
      <div class="panel-btn" @click="$emit('action', 'showGame')">
        <i class="game-icon"></i>
      </div>
      <div class="panel-btn" @click="$emit('action', 'showMenu')">
        <i class="menu-icon"></i>
      </div>
      <div class="panel-btn" @click="$emit('action', 'showGift')">
        <i class="gift-icon"></i>
      </div>
    </div>
  </div>
</template>
