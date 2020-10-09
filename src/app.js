
import "jquery-mask-plugin";

// dropdown plaguin
import "./components/form-elements/dropdown/dropdown";
import "./components/form-elements/my_dropdown/dropdown";

// после require т.к. там подключаются зависимые стили
import "./styles/main.scss";


const post = "Webpack jquery work!"
$('pre').html(post.toString())

console.log('Console hello!');
