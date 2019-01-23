### vue中的 v-model 的语法糖
```
vue中的v-model实现双线数据绑定的
 <div class = 'app'>
 <input v-model = ‘val’>
<div> {{ val }}</div>
 </div>

const minevue = new Vue({
                      data:{
                        val:''
                      }
                      )$mount('.app')
一个简单是双向数据绑定   
```
####下面是简单的原理

```
 <input v-bind:value = 'val' v-on:input = "val = value">
 只要将 input 的属性 value 的值通过input 事件传递给 minevue 中定义的 val 就可以实现双向数据绑定
 但是这样写是在input事件中是获取不到 value 属性的值的。
 于是 vue 进行了封装  $event.target.value
 即 在input 元素中 value 属性 = $event.target.value
 于是就实现了双向数据绑定。

```
