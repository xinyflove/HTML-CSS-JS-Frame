

var html = '';

function showImageDialog(obj){
	//$("#modal-webuploader").remove();
	//$("body").append(html);
	$("#modal-webuploader").modal('show');
	
	//在点击弹出模态框的时候再初始化WebUploader，解决点击上传无反应问题
	$("#modal-webuploader").on("shown.bs.modal", function() {
		init();
	});
}

function init(){
	jQuery(function() {
		var $ = jQuery, // just in case. Make sure it's not an other libaray.
	
			$wrap = $('#uploader'),
	
			// 图片容器
			$queue = $('<ul class="filelist"></ul>')
			.appendTo($wrap.find('.queueList')),
	
			// 状态栏，包括进度和控制按钮
			$statusBar = $wrap.find('.statusBar'),
	
			// 文件总体选择信息。
			$info = $statusBar.find('.info'),
	
			// 上传按钮
			$upload = $wrap.find('.uploadBtn'),
	
			// 没选择文件之前的内容。
			$placeHolder = $wrap.find('.placeholder'),
	
			// 总体进度条
			$progress = $statusBar.find('.progress').hide(),
	
			// 添加的文件数量
			fileCount = 0,
	
			// 添加的文件总大小
			fileSize = 0,
	
			// 优化retina, 在retina下这个值是2
			ratio = window.devicePixelRatio || 1,
	
			// 缩略图大小
			thumbnailWidth = 110 * ratio,
			thumbnailHeight = 110 * ratio,
	
			// 可能有pedding, ready, uploading, confirm, done.
			state = 'pedding',
	
			// 所有文件的进度信息，key为file id
			percentages = {},
	
			supportTransition = (function() {
				var s = document.createElement('p').style,
					r = 'transition' in s ||
					'WebkitTransition' in s ||
					'MozTransition' in s ||
					'msTransition' in s ||
					'OTransition' in s;
				s = null;
				return r;
			})(),
	
			// WebUploader实例
			uploader;
	
		if(!WebUploader.Uploader.support()) {
			alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
			throw new Error('WebUploader does not support the browser you are using.');
		}
	
		// 实例化
		uploader = WebUploader.create({
			pick: { // 指定选择文件的按钮容器，不指定则不创建按钮。
				id: '#filePicker', // 指定选择文件的按钮容器，不指定则不创建按钮。注意 这里虽然写的是 id, 但是不是只支持 id, 还支持 class, 或者 dom 节点。
				label: '点击选择图片', // 请采用 innerHTML 代替
				innerHTML: '点击选择图片', // 指定按钮文字。不指定时优先从指定的容器中看是否自带文字。
				// multiple {Boolean} 是否开起同时选择多个文件能力。
			},
			dnd: '#uploader .placeholder', // 指定Drag And Drop拖拽的容器，如果不指定，则不启动。
			paste: document.body, // 指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body.
	
			accept: { // 指定接受哪些类型的文件。 由于目前还有ext转mimeType表，所以这里需要分开指定。
				title: 'Images', // 文字描述
				extensions: 'gif,jpg,jpeg,bmp,png', // 允许的文件后缀，不带点，多个用逗号分割。
				mimeTypes: 'image/jpg,image/jpeg,image/png' // 多个用逗号分割
				//mimeTypes: 'image/*'
			},
	
			// swf文件路径
			swf: BASE_URL + '/Uploader.swf',
	
			disableGlobalDnd: true, // 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开。
	
			chunked: true,
			// server: 'http://webuploader.duapp.com/server/fileupload.php',
			server: 'server/fileupload.php',
			fileNumLimit: 300, // 验证文件总数量, 超出则不允许加入队列。
			fileSizeLimit: 5 * 1024 * 1024, // 200 M 验证文件总大小是否超出限制, 超出则不允许加入队列。
			fileSingleSizeLimit: 1 * 1024 * 1024 // 50 M 验证单个文件大小是否超出限制, 超出则不允许加入队列
		});
	
		// 添加“添加文件”的按钮，
		uploader.addButton({
			id: '#filePicker2',
			label: '继续添加'
		});
	
		/**
		 * 文件队列前
		 * @param {Object} file
		 */
		uploader.onBeforeFileQueued = function(file) {}
	
		/**
		 * 文件队列
		 * @param {Object} file
		 */
		uploader.onFileQueued = function(file) {
			fileCount++; // 添加文件数
			fileSize += file.size; // 添加文件大小
	
			if(fileCount === 1) {
				$placeHolder.addClass('element-invisible');
				$statusBar.show();
			}
	
			addFile(file); // 添加文件
			setState('ready'); // 设置状态为ready
	
			updateTotalProgress(); // 更新总进度
		};
	
		/**
		 * 文件队列后
		 * @param {Object} file
		 */
		uploader.onFilesQueued = function(file) {}
	
		/**
		 * 删除队列文件
		 * @param {Object} file
		 */
		uploader.onFileDequeued = function(file) {
			fileCount--; // 减去文件数
			fileSize -= file.size; // 减去文件大小
	
			if(!fileCount) {
				setState('pedding');
			}
	
			removeFile(file); // 移除文件
			updateTotalProgress(); // 更新总进度
		};
	
		// 所有的事件触发都会响应到
		uploader.on('all', function(type) {
			var stats;
			switch(type) {
				case 'uploadFinished':
					setState('confirm');
					break;
	
				case 'startUpload':
					setState('uploading');
					break;
	
				case 'stopUpload':
					setState('paused');
					break;
	
			}
		});
	
		/**
		 * 报错函数
		 * @param {Object} code
		 */
		uploader.onError = function(code) {
			if(code == 'Q_TYPE_DENIED') {
				layer.msg('Eroor: ' + '文件类型错误');
			} else {
				layer.msg('Eroor: ' + code);
			}
		};
	
		/**
		 * 上传过程中触发，携带上传进度
		 * @param {Object} file
		 * @param {Object} percentage
		 */
		uploader.onUploadProgress = function(file, percentage) {
			var $li = $('#' + file.id),
				$percent = $li.find('.progress span');
	
			$percent.css('width', percentage * 100 + '%');
			percentages[file.id][1] = percentage;
			updateTotalProgress(); // 更新总进度
		};
	
		$upload.on('click', function() { // 点击上传
	
			if($(this).hasClass('disabled')) {
				return false;
			}
	
			if(state === 'ready') {
				uploader.upload();
			} else if(state === 'paused') {
				uploader.upload();
			} else if(state === 'uploading') {
				uploader.stop();
			}
		});
	
		// 重新上传
		$info.on('click', '.retry', function() {
			uploader.retry();
		});
	
		// 忽略
		$info.on('click', '.ignore', function() {
			//alert('todo');
			$("#modal-webuploader").modal('hide');
		});
	
		// 文件上传成功，给item添加成功class, 用样式标记上传成功。
		uploader.on('uploadSuccess', function(file, res) {
			$('#' + file.id).addClass('upload-state-done');
		});
	
		$upload.addClass('state-' + state);
	
		updateTotalProgress(); // 更新总进度
	
		// 当有文件添加进来时执行，负责view的创建
		function addFile(file) {
			var $li = $('<li id="' + file.id + '">' +
					'<p class="title">' + file.name + '</p>' +
					'<p class="imgWrap"></p>' +
					'<p class="progress"><span></span></p>' +
					'</li>'),
	
				$btns = $('<div class="file-panel">' +
					'<span class="cancel">删除</span>' +
					'<span class="rotateRight">向右旋转</span>' +
					'<span class="rotateLeft">向左旋转</span></div>').appendTo($li), // 顶部菜单添加到file
	
				$prgress = $li.find('p.progress span'), // file进度条
	
				$wrap = $li.find('p.imgWrap'), // file div
	
				$info = $('<p class="error"></p>'), // file 错误信息
	
				showError = function(code) { // 提示错误信息函数
					switch(code) {
						case 'exceed_size':
							text = '文件大小超出';
							break;
	
						case 'interrupt':
							text = '上传暂停';
							break;
	
						default:
							text = '上传失败，请重试';
							break;
					}
	
					$info.text(text).appendTo($li); // 错误信息添加到file
				};
	
			if(file.getStatus() === 'invalid') { // file 无效的
				showError(file.statusText);
			} else {
				// @todo lazyload
				$wrap.text('预览中');
	
				// 创建缩略图
				// 如果为非图片文件，可以不用调用此方法。
				// thumbnailWidth x thumbnailHeight 为 100 x 100
				uploader.makeThumb(file, function(error, src) {
					if(error) {
						$wrap.text('不能预览');
						return;
					}
	
					var img = $('<img src="' + src + '">');
					$wrap.empty().append(img);
				}, thumbnailWidth, thumbnailHeight);
	
				percentages[file.id] = [file.size, 0]; // 存入文件的进度信息 0->未上传
				file.rotation = 0; // 文件角度
			}
	
			file.on('statuschange', function(cur, prev) { // 文件状态变化
				
				if(prev === 'progress') { // 上一步是progress当前步是complete
					$prgress.width('100%'); // file 进度条宽度变100%
				} else if(prev === 'queued') { // 上一步是queued当前步是progress
					$li.off('mouseenter mouseleave'); // 解除事件绑定
					$btns.remove(); // 移除file顶部菜单
				}
	
				if(cur === 'error' || cur === 'invalid') { // 当前步错误或者无效
					showError(file.statusText);
					percentages[file.id][1] = 1;
					$prgress.width(0);
				} else if(cur === 'interrupt') { // 上传暂停
					showError('interrupt');
				} else if(cur === 'queued') { // 加入队列
					percentages[file.id][1] = 0; // 状态未上传
				} else if(cur === 'progress') { // 上传中
					$info.remove(); // 移除错误信息
					$prgress.css('display', 'block'); // 显示进度条
				} else if(cur === 'complete') { // 完成
					$li.append('<span class="success"></span>');
				}
	
				// 设置file状态class
				$li.removeClass('state-' + prev).addClass('state-' + cur);
			});
	
			$li.on('mouseenter', function() { // 添加鼠标进入事件
				$btns.stop().animate({
					height: 30
				});
			});
	
			$li.on('mouseleave', function() { // 添加鼠标离开事件
				$btns.stop().animate({
					height: 0
				});
			});
	
			$btns.on('click', 'span', function() { // file顶部菜单click事件
				var index = $(this).index(),
					deg;
	
				switch(index) {
					case 0: // 删除
						uploader.removeFile(file);
						return;
	
					case 1: // 右转90
						file.rotation += 90;
						break;
	
					case 2: // 左转90
						file.rotation -= 90;
						break;
				}
	
				if(supportTransition) {
					deg = 'rotate(' + file.rotation + 'deg)';
					$wrap.css({
						'-webkit-transform': deg,
						'-mos-transform': deg,
						'-o-transform': deg,
						'transform': deg
					});
				} else {
					$wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
					// use jquery animate to rotation
					// $({
					//     rotation: rotation
					// }).animate({
					//     rotation: file.rotation
					// }, {
					//     easing: 'linear',
					//     step: function( now ) {
					//         now = now * Math.PI / 180;
	
					//         var cos = Math.cos( now ),
					//             sin = Math.sin( now );
	
					//         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
					//     }
					// });
				}
			});
	
			$li.appendTo($queue); // file 添加到 filelist中
		}
	
		// 负责view的销毁
		function removeFile(file) {
			var $li = $('#' + file.id);
	
			delete percentages[file.id];
			updateTotalProgress(); // 更新总进度
			$li.off().find('.file-panel').off().end().remove();
		}
	
		/**
		 * 初始化总上传进度条
		 */
		function updateTotalProgress() {
			var loaded = 0,
				total = 0,
				spans = $progress.children(),
				percent;
	
			// 遍历每个file的进度条
			$.each(percentages, function(k, v) {
				total += v[0];
				loaded += v[0] * v[1];
			});
	
			percent = total ? loaded / total : 0; // 计算百分比
	
			spans.eq(0).text(Math.round(percent * 100) + '%');
			spans.eq(1).css('width', Math.round(percent * 100) + '%');
	
			updateStatus();
		}
	
		/**
		 * 更新总上传文字信息
		 */
		function updateStatus() {
			var text = '',
				stats;
	
			if(state === 'ready') {
				text = '选中' + fileCount + '张图片，共' +
					WebUploader.formatSize(fileSize) + '。';
			} else if(state === 'confirm') {
				stats = uploader.getStats();
				if(stats.uploadFailNum) {
					text = '已成功上传' + stats.successNum + '，' +
						stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
				}
	
			} else {
				stats = uploader.getStats();
				text = '共' + fileCount + '张（' +
					WebUploader.formatSize(fileSize) +
					'），已上传' + stats.successNum + '张';
	
				if(stats.uploadFailNum) {
					text += '，失败' + stats.uploadFailNum + '张';
				}
			}
	
			$info.html(text);
		}
	
		function setState(val) {
			var file, stats;
			
			if(val === state) {
				return;
			}
	
			$upload.removeClass('state-' + state);
			$upload.addClass('state-' + val);
			state = val;
	
			switch(state) {
				case 'pedding':
					$placeHolder.removeClass('element-invisible');
					$queue.parent().removeClass('filled');
					$queue.hide();
					$statusBar.addClass('element-invisible');
					uploader.refresh();
					break;
	
				case 'ready':
					$placeHolder.addClass('element-invisible');
					$('#filePicker2').removeClass('element-invisible');
					$queue.parent().addClass('filled');
					$queue.show();
					$statusBar.removeClass('element-invisible');
					uploader.refresh();
					break;
	
				case 'uploading':
					$('#filePicker2').addClass('element-invisible');
					$progress.show();
					$upload.text('暂停上传');
					break;
	
				case 'paused':
					$progress.show();
					$upload.text('继续上传');
					break;
	
				case 'confirm':
					$progress.hide();
					$upload.text('开始上传').addClass('disabled');
	
					stats = uploader.getStats();
					if(stats.successNum && !stats.uploadFailNum) {
						setState('finish');
						return;
					}
					break;
				case 'finish':
					stats = uploader.getStats();
					if(stats.successNum) {
						layer.msg('上传成功');
						$('#modal-webuploader').modal('hide')
					} else {
						// 没有成功的图片，重设
						state = 'done';
						location.reload();
					}
					break;
			}
	
			updateStatus();
		}
	
	});
}
