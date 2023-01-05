import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 循环注册
const elements = [Button, Form, FormItem, Input]
elements.forEach(item => Vue.use(item))

// 将弹框组件挂载在Vue的原型对象上
Vue.prototype.$message = Message