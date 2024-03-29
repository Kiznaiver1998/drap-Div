(function(){

	var transform = getTransform();
	function Drag(selector) {
		this.elem = typeof selector == 'Object' ? selector : document.getElementById(selector);
		this.position = {
			startX: 0,
			startY: 0,
			sourceX: 0,
			sourceY: 0
		}
		this.init();
	}
	//原型
	Drag.prototype = {
		constructor: Drag,
		init: function () {
				this.setDrag();
		},
		getStyle: function (property) {
			return document.defaultView.getComputedStyle 
				   ? document.defaultView.getComputedStyle(this.elem, false)[property] 
				   : this.elem.currentStyle[property];
		},
		getPosition: function () {
			var pos ={x: 0, y: 0};
			if(transform) {
				var transformValue = this.getStyle(transform);
				if(transformValue == 'none') {
					this.elem.style[transform] = 'translate(0, 0)';
				} else{
					var temp = transformValue.match(/-?\d+/g);
					pos = {
						x: parseInt(temp[4].trim()),
						y: parseInt(temp[5].trim())
					}
				}
			}else{
				if(this.getStyle('position') == 'static') {
					this.elem.style.position = 'relative';
				}else{
					pos = {
						x: parseInt(this.getStyle('left') ? this.getStyle('left') : 0),
						y: parseInt(this.getStyle('top') ? this.getStyle('top') : 0)
					}
				}
			}
			return pos;
		},
		setPosition: function(pos) {
			if(transform) {
				this.elem.style[transform] = 'translate(' + pos.x + 'px,' + pos.y + 'px)'; 
			}else {
				this.elem.style.left = pos.x + 'px';
				this.elem.style.top = pos.y + 'px';
			}
		},
		setDrag: function () {
			var self = this;
			this.elem.addEventListener('mousedown', start,false);
			function start(event) {
				self.position.startX = event.pageX;
				self.position.startY = event.pageY;

				var pos = self.getPosition();

				self.position.sourceX = pos.x;
				self.position.sourceY = pos.y;

				document.addEventListener('mousemove', move, false);
				document.addEventListener('mouseup', end, false);
			}
			function move(event) {
				var currentX = event.pageX;
				var currentY = event.pageY;

				var distanceX = currentX - self.position.startX;
				var distanceY = currentY - self.position.startY;

				self.setPosition({
					x: (self.position.sourceX + distanceX).toFixed(),
					y: (self.position.sourceY + distanceY).toFixed()
				})
			}
			function end(event) {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end);
            }

		}
	};
	function getTransform(){
		var transform = '',
			divStyle  = document.createElement('div').style,
			transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
			i = 0,
			len = transformArr.length;
		for(; i < len; i++){
			if(transformArr[i] in divStyle){
				return transform = transformArr[i];
			}
		}
		return transform;
	}
	window.Drag = Drag;
})()

new Drag('target1');
new Drag('target2');