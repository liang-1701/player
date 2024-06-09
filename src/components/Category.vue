<template>
    <!-- 歌单展示 -->
    <div class="category">
        <div class="img" >
            <img v-lazy="" @load="">
            <div class="cover">
                <i-play theme="filled" size="40" fill="#333"/>
            </div>
        </div>
        <div class="title">标题测试</div>
    </div>
</template>

<script  lang="ts" setup>

</script>

<style lang="scss" scoped>
.category {
    display: inline-block;
    margin: 20px;
    width: 125px;
    height: 170px;
    border-radius: 5px;
    box-shadow:  0 0 6px #c5c5c5, 0 0 6px #ffffff;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    .img {
        width: 125px;
        height: 125px;
        position: relative;
        border: 1px solid rgba(6, 3, 82, 0.1);
        img {
            width: 100%;
            height: 100%;
        }
        .cover {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(#a9a6a6, 0.6);
            visibility: hidden;
        }
    }
    .title {
        font-size: 14px;
        margin: 5px 2px 0 2px;
        overflow: hidden;
    }
}
</style>