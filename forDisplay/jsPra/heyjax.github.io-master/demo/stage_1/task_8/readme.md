# 任务目的
使用 HTML 与 CSS 实现类似 BootStrap 的响应式 12 栏网格布局，根据屏幕宽度，元素占的栏数不同。

# 响应式布局

###为什么要使用响应式布局
* 多栏布局中最大的挑战之一就是确保它能在各种各样的屏幕尺寸下正确工作，为此，提出了响应式设计。因此我们也不再根据桌面浏览器窗口尺寸建立网站。

### 适应媒体查询
* CSS3扩展了媒体类型的概念以检查特定的屏幕尺寸，所以CSS在做一个设计的时候可以更加精确
* 例如，我们向将一组CSS规则应用到小屏幕上时，可以使用`@media`规则设置CSS声明，从而设置两种适应不同的屏幕大小的样式规则
```
@media screen and (min-width:760px){
 //这里写css规则，当屏幕大小至少为760px时，可以应用这里写的css规则
}
```
* 为多种屏幕写不同的样式规则
```
@media screen and (min-width:480px){
 //这里写css规则，当屏幕大小至少为480px时，可以应用这里写的css规则
}
@media screen and (min-width:760px){
 //这里写css规则，当屏幕大小至少为760px时，可以应用这里写的css规则
}
@media screen and (min-width:1200px){
 //这里写css规则，当屏幕大小至少为1200x时，可以应用这里写的css规则
}
```
* 除了以上用像素判别以外，媒体查询还有其他的判别标准，具体可以查询[MDN官方文档](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Media_queries)

# 流式布局

### 为什么使用流式布局
* 尽管媒体查询的断点可以让我们使用当前的窗口布局，但是断点难以覆盖所有的不同类型的窗口。而通过创造流式布局则可以让我们随时随地都保持相对的比例。
* 上面提到流式布局是相对的，所以在我们一开始设计的时候，我们就要将相对应的元素块度与当前宽度做除法，得到以百分比为单位的宽度。为什么是百分比？因为在百分比相对单位下，浏览器的窗口扩大时，相对应元素的宽度也会扩大。
* 使用 `meta viewport` 之后可以让你的布局在移动浏览器上显示的更好

# SASS

### 为什么要用CSS预处理器
Sass是一个你所写的CSS样式表和css文件浏览器之间的预处理。Sass（Syntactically Awesome Stylesheets的缩写）弥补了css语言的一点不足之处。它允许你写css代码不需要重复。这对于创造可维护的样式将是非常有效的。

### SASS的优点
* 允许使用变量，所有变量均以$开头
* 允许层级嵌套
* 允许代码复用，利用`@mixin`定义代码块，利用`@include`调用代码块，利用`@extend`可以继承代码块
* 允许使用条件判断，例如if，for等等

# 构造网格系统

### 所需要的元素
* a container
* rows
* columns
* gutters (the space between columns)

### 工作原理
![](img/grid-elements.png)

* 参考bootstrap的网格系统，将网页分成十二栏（图里是六栏），每一栏所占总页面的十二分之一
* container占总页面的百分百
* row占一行，确保所有元素能够一字排开，如果超过十二栏了，就会挤到下一行，一般会清除浮动
* columns将占据十二栏中的某几栏，一般向左浮动
* gutter是指columns的距离，一般是内边距，同时设置columns为borderbox

### 媒体查询
* 在大屏幕时，某些元素所占的栏目和在小屏幕时不一样，这是就需要媒体查询

### 实现方式
* 利用代码块生成所需要的元素
```
@mixin box {
  border: #999 1px solid;
  background-color: #eee;
  height: 50px;
}
$grid-columns:      12;

// Creates a wrapper for a series of columns
@mixin make-row {
  margin-left:  10px;
  margin-right: 10px;
  // @include clearfix()
}

// Make the element grid-ready (applying everything but the width)
@mixin make-col {
  position: relative;
  float: left;
  min-height: 1px;
  box-sizing: border-box;
  padding: 10px;
}

// Set a width (to be used in or out of media queries)
@mixin make-col-span($columns) {
  width: percentage(($columns / $grid-columns));
}
```
* 主要利用了SASS中的for语句得到两种屏幕大小下的十二栏
```
@for $i from 1 through $grid-columns {
  .col-md-#{$i} { @media only screen and (min-width: 769px) { @include make-col-span($i);@include make-col;} }
  .col-sm-#{$i} { @media only screen and (max-width: 768px) { @include make-col-span($i);@include make-col;} }
}
```

***

# 扩展阅读-Bootstrap grid system

### 工作原理
* 起作用的主要有三个元素，分别是containers，rows和columns。
    * containers，用于固定宽度，或者扩展到全屏宽度，使里面的内容居中并协调其他网格块元素
    * rows，确保水平方向的块元素能够一字排开。
    * columns，内容应该放在columns里面，同时有且仅有columns可以作为row的直接子元素。
    * clomuns的class名称指明块元素占据栏的数量，在这里网页会被分为12栏，如果你想要占据三分之一的空间，则应该使用`.col-sm-4`
    * columns的宽度是根据百分数来设置，所以它总是可以充满的并且其大小总是相对于其父元素。
    * columns利用内边距在互相独立的columns创建类似排水渠的间隔
    * 这里的响应式断点总共有5个层级包括
        * extra small<544px
        * small≥544px
        * medium≥768px
        * large≥992px
        * extra large≥1200px。
    * 网格式的层级基于最小的层级，即在其以上的层级都适用，例如`.com-sm-4`就适用于small，medium，large, and extra large。
    * 你可以自己预定义网格的class名称或者sass的mixin来扩展语义标记。

### 网格选项
* Grid behavior：在xs中是一直都会水平显示，而其他层级中，一开始是折叠，直到到达断点以后才会一字排开
* Container width：
    * extra samll: none(auto);
    * small: 576px;
    * medium: 720px;
    * large: 940px;
    * extra large: 1140px;
* of columns: 12
* Gutter width: 1.875rem / 30px (15px on each side of a column)
* 支持内嵌，元素偏置，元素顺序

### SASS mixin
* 默认变量
```
$grid-breakpoints: (
  // Extra small screen / phone
  xs: 0,
  // Small screen / phone
  sm: 544px,
  // Medium screen / tablet
  md: 768px,
  // Large screen / desktop
  lg: 992px,
  // Extra large screen / wide desktop
  xl: 1200px
);


$grid-columns:      12;
$grid-gutter-width: 1.875rem;
```
* 混合器
```
// Creates a wrapper for a series of columns
@mixin make-row($gutter: $grid-gutter-width) {
  margin-left:  ($gutter / -2);
  margin-right: ($gutter / -2);
  @include clearfix();
}

// Make the element grid-ready (applying everything but the width)
@mixin make-col($gutter: $grid-gutter-width) {
  position: relative;
  float: left;
  min-height: 1px;
  padding-left:  ($gutter / 2);
  padding-right: ($gutter / 2);
}

// Set a width (to be used in or out of media queries)
@mixin make-col-span($columns) {
  width: percentage(($columns / $grid-columns));
}

// Get fancy by offsetting, or changing the sort order
@mixin make-col-offset($columns) {
  margin-left: percentage(($columns / $grid-columns));
}
@mixin make-col-push($columns) {
  left: percentage(($columns / $grid-columns));
}
@mixin make-col-pull($columns) {
  right: percentage(($columns / $grid-columns));
}
```
* 示例
```
// Creates a wrapper for a series of columns
@mixin make-row($gutter: $grid-gutter-width) {
  margin-left:  ($gutter / -2);
  margin-right: ($gutter / -2);
  @include clearfix();
}

// Make the element grid-ready (applying everything but the width)
@mixin make-col($gutter: $grid-gutter-width) {
  position: relative;
  float: left;
  min-height: 1px;
  padding-left:  ($gutter / 2);
  padding-right: ($gutter / 2);
}

// Set a width (to be used in or out of media queries)
@mixin make-col-span($columns) {
  width: percentage(($columns / $grid-columns));
}

// Get fancy by offsetting, or changing the sort order
@mixin make-col-offset($columns) {
  margin-left: percentage(($columns / $grid-columns));
}
@mixin make-col-push($columns) {
  left: percentage(($columns / $grid-columns));
}
@mixin make-col-pull($columns) {
  right: percentage(($columns / $grid-columns));
}
```
