angular.module('classeur.opt.zenMode', [])
	.directive('clZenModeSettings', function() {
		return {
			restrict: 'E',
			templateUrl: 'opt/zenMode/zenModeSettings.html'
		};
	})
	.directive('clZenMode', function(clPanel, clEditorLayoutSvc, clSettingSvc) {
		clSettingSvc.setDefaultValue('zenMode', true);

		return {
			restrict: 'E',
			template: '<div class="zen panel background hidden"></div>',
			link: function(scope, element) {
				var zenPanel = clPanel(element, '.zen.panel').width(4000).left(-1500);
				var parentNode = element[0].parentNode;

				var timeout, enabled = true, lastClientX, lastClientY;
				function hideZenPanel(evt) {
					if(evt) {
						if(evt.type === 'mousemove' && lastClientX === evt.clientX && lastClientY === evt.clientY) {
							return;
						}
						lastClientX = evt.clientX;
						lastClientY = evt.clientY;
						var minLeft = parentNode.getBoundingClientRect().left + parentNode.offsetWidth;
						if(evt.clientX < minLeft) {
							return;
						}
					}
					clearTimeout(timeout);
					if (enabled === true) {
						enabled = false;
						zenPanel.move('fast').set('opacity', 0).ease('out').end(function() {
							!enabled && zenPanel.$elt.addClass('hidden');
						});
					}
					if (!clSettingSvc.values.zenMode || !clEditorLayoutSvc.isEditorOpen || clEditorLayoutSvc.isSidePreviewOpen || clEditorLayoutSvc.isMenuOpen) {
						return;
					}
					timeout = setTimeout(function() {
						enabled = true;
						zenPanel.$elt.removeClass('hidden');
						zenPanel.$$elt.offsetWidth;
						zenPanel.move().set('opacity', 1).duration(2000).ease('in').end();
					}, 5000);
				}

				hideZenPanel();
				document.addEventListener('mousemove', hideZenPanel);
				document.addEventListener('click', hideZenPanel);

				scope.$watch('editorLayoutSvc.isEditorOpen', hideZenPanel.bind(null, null));
				scope.$on('$destroy', function() {
					document.removeEventListener('mousemove', hideZenPanel);
					document.removeEventListener('click', hideZenPanel);
				});
			}
		};
	});