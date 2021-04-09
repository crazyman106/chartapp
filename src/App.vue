<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
	min-width:1100px;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.el-main{
	padding:5px !important;
}
.el-tabs__header{
	margin:0 0 0 5px !important;
}
.extab{
   
}
</style>
