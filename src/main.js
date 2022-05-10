import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import http from '@/config/http'
import ElementUI,{Message} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

Vue.use(ElementUI);
Vue.prototype.$http = http;
Vue.config.productionTip = false;
// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')
/**
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
class DonMessage {
    success (options, single = true) {
        this[showMessage]('success', options, single)
    }
    warning (options, single = true) {
        this[showMessage]('warning', options, single)
    }
    info (options, single = true) {
        this[showMessage]('info', options, single)
    }
    error (options, single = true) {
        this[showMessage]('error', options, single)
    }

    [showMessage] (type, options, single) {
        if (single) {
            // 判断是否已存在Message
            if (document.getElementsByClassName('el-message').length === 0) {
                Message[type](Object.assign(options,{duration: 1000}))
                console.log(options)
            }
        } else {
            Message[type](options)
        }
    }
}
// Vue原型上加设置了时间的element message
Vue.prototype.$durationMes=
    // return new DonMessage(Object.assign(option,{duration: 1000}))
    new DonMessage()

// }
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
