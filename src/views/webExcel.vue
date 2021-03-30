<template>
  <div class="webExcel">
    <el-container>
      <el-aside width="200px"></el-aside>
      <el-main>
        <Designer />
      </el-main>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Designer from "@/components/Designer/Designer.vue";

export default {
  name: "WebExcel",
  components: {
    Designer,
  },
};
</script>
<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}

</style>