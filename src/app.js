

//import * as $ from "jquery";
import "jquery-mask-plugin";


import "./assets/components/form-elements/textfield/dropdown";

// после require т.к. там подключаются зависимые стили
import "./styles/main.scss";


const post = "Webpack jquery work!"
$('pre').html(post.toString())

console.log('Console hello!');
