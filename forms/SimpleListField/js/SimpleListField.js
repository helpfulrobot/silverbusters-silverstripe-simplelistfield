jQuery.entwine("simplelist", function($) {
	$('textarea.simplelist').entwine({
		onmatch: function() {
			var holderID = this.attr('id'),
				list     = ( this.text() ? JSON.parse( this.text() ) : {} ),
				items    = (typeof list.items !== 'undefined') ? list.items : {};
			
			// set list heading
			$('#'+ holderID +'_heading').val( list.heading );
			
			// set list state
			if ( (typeof list.enable !== 'undefined') && list.enable ) { console.log(1);
				$('#'+ holderID +'_state').prop('checked', true);
			}else{
				$('#'+ holderID +'_state').prop('checked', false);
			}
			
			// sortable
			$('#'+ holderID +'_wrapper').sortable( {
				items: "> .dlf-fiedlist",
				handle: '.dlf-sortable-handle',
				update: function(e, ui){ SimpleListField.saveToHolder(holderID) },
				start: function(e, ui){
					$(this).find('textarea.slf-htmleditor').each(function(){
						tinyMCE.execCommand( 'mceRemoveControl', false, $(this).attr('id') );
					});
				},
				stop: function(e,ui) {
					$(this).find('textarea.slf-htmleditor').each(function(){
						tinyMCE.execCommand( 'mceAddControl', true, $(this).attr('id') );
					});
				}
			} );
			
			// set list items
			if ( !jQuery.isEmptyObject(items) )
			{
				var reverseItems = {};
				
				jQuery.each(Object.keys(items).reverse(), function(index, key) {
					reverseItems[key] = items[key];
				});
				
				$.each(reverseItems, function(index, item) {
					item = jQuery.extend({'id': index}, item);
					SimpleListField.add(holderID, item);
				});
			}
		}
	});
});

var SimpleListField = {
	/**
	 * Add item
	 */
	add: function(holderID, item)
	{
		var itemID = ( (typeof item !== 'undefined') && item && (typeof item.id !== 'undefined') && item.id != '' ) ? item.id : this.generateID(6)
		var fields = jQuery('#'+ holderID).data('fields');
		
		var html   = '<div id="'+ holderID +'_dlf_item_'+ itemID +'" class="dlf-fiedlist">';
			html  += '<div class="dlf-fieldlist-panel clearfix"><span class="dlf-sortable-handle">&nbsp;</span><button onclick="SimpleListField.remove(\''+ holderID +'\', \''+ itemID +'\')" class="gridfield-button-delete nolabel" title="Delete" data-icon="cross-circle">\
								Remove\
							</button></div><div class="dlf-fieldlist-content">';
		
		jQuery.each(fields, function( index, field ) {
			var attributes = {
				name: holderID +'_item['+ itemID +']['+ field.name +']',
				id: holderID +'_item_'+ itemID +'_'+ field.name,
				onblur: 'SimpleListField.saveToHolder(\''+ holderID +'\')'
			}
			
			var value = (typeof item !== 'undefined' && typeof item[field.name] !== 'undefined') ? item[field.name] : ( typeof field.default_value !== 'undefined' ? field.default_value : '' );
			
			switch (field.type) {
				case 'textarea':
					html += '<div class="field textarea simplelistfield-input dlf-input-wrapper">\
						<label class="left" for="'+ attributes.id +'">'+ field.label +'</label>\
						<div class="middleColumn">\
							<textarea type="text" class="textarea dlf-item-input"\
								id="'+ attributes.id +'" name="'+ attributes.name +'" onblur="'+ attributes.onblur +'"\
								data-holder-id="'+ holderID +'" data-item-id="'+ itemID +'" cols="20" rows="6">'+ value +'</textarea>\
						</div>\
					</div>';
					
					break;
					
				case 'htmleditor':
					html += '<div class="field slf-htmleditor simplelistfield-input dlf-input-wrapper">\
						<label class="left" for="'+ attributes.id +'">'+ field.label +'</label>\
						<div class="middleColumn">\
							<textarea type="text" class="slf-htmleditor dlf-item-input"\
								id="'+ attributes.id +'" name="'+ attributes.name +'"\
								data-holder-id="'+ holderID +'" data-item-id="'+ itemID +'" cols="20" rows="6">'+ value +'</textarea>\
						</div>\
					</div>';
					
					// setup tinymce
					setTimeout(function(){
						var tinymceMCE_cfg = jQuery.extend(jQuery.extend(true, {}, ssTinyMceConfig),{
							width : "650",
							height: "300",
							mode : "exact",
							elements : attributes.id,
							setup: function(ed){
								ed.onInit.add(function(ed){
									// on focus
									jQuery(ed.getDoc()).contents().find('body').focus(function(){});
									
									// on blur
									jQuery(ed.getDoc()).contents().find('body').blur(function(){
										jQuery('#' + attributes.id).html(ed.getContent());
										
										eval(attributes.onblur);
									});
								});
							}
						});
						
						jQuery.each(tinymceMCE_cfg, function(i, v){
							if ( i.indexOf('theme_advanced_buttons') != -1 ) {
								tinymceMCE_cfg[i] = v.replace(/sslink/gi, "link");
								tinymceMCE_cfg[i] = tinymceMCE_cfg[i].replace(/ssmedia/gi, "media,image");
							}
							
							if (i == 'plugins') {
								tinymceMCE_cfg[i] = v.replace(/-ssbuttons/gi, "advhr,advimage,advlink,media");
							}
						});
						
						tinyMCE.init(tinymceMCE_cfg);
					}, 300);
					
					break;
				
				case 'dropdown':
					var options = '';
					
					if ( typeof field.list !== 'undefined' ) {
						jQuery.each(field.list, function( option_value, option_label ) {
							options += '<option value="'+ option_value +'" '+ ( option_value == value ? 'selected="selected"' : '' ) +'>'+ option_label +'</option>';
						});
					};
					
					html += '<div class="field textarea simplelistfield-dropdown simplelistfield-input dlf-input-wrapper">\
						<label class="left" for="'+ attributes.id +'">'+ field.label +'</label>\
						<div class="middleColumn">\
							<select class="dropdown dlf-item-input"\
								id="'+ attributes.id +'" name="'+ attributes.name +'" onchange="'+ attributes.onblur +'"\
								data-holder-id="'+ holderID +'" data-item-id="'+ itemID +'">\
								'+ options +'\
							</select>\
						</div>\
					</div>';
					
					break;
					
				default:
					html += '<div class="field text simplelistfield-input dlf-input-wrapper">\
						<label class="left" for="'+ attributes.id +'">'+ field.label +'</label>\
						<div class="middleColumn">\
							<input type="text" value="'+ value +'" class="text dlf-item-input"\
								id="'+ attributes.id +'" name="'+ attributes.name +'" onblur="'+ attributes.onblur +'"\
								data-holder-id="'+ holderID +'" data-item-id="'+ itemID +'" />\
						</div>\
					</div>';
			}
		});
		
		html += '</div></div>';
		
		jQuery(html).insertAfter(jQuery('#'+ holderID +'_dlf_heading'));
		
		jQuery('#'+ holderID +'_wrapper').sortable("refresh");
	},
	
	/**
	 * Remove item
	 */
	remove: function(holderID, itemID){
		// remove the input
		jQuery('#'+ holderID +'_dlf_item_'+ itemID +'').remove();
		
		// save new list
		this.saveToHolder(holderID);
		
		// reload fieldlist
		jQuery('#'+ holderID +'_wrapper').sortable("refresh");
	},
	
	/**
	 * Save to the holder
	 */
	saveToHolder: function(holderID)
	{
		var items = jQuery('.dlf-item-input').serializeJSON(),
			items = (typeof items !== 'undefined' && typeof items[holderID + '_item'] !== 'undefined') ? items[holderID + '_item'] : {};
			
		var holderEle = jQuery('#'+ holderID);
		
		holderEle.text(JSON.stringify({
			scenario: holderEle.data('scenario'),
			enable: jQuery('#'+ holderID + '_state').prop('checked'),
			heading: jQuery('#'+ holderID + '_heading').val(),
			items: items
		}));
	},
	
	/**
	 * Load to holder
	 */
	loadToHolder: function(holderID){},
	
	/**
	 *
	 */
	toggle: function(e, fieldName){
			e = jQuery(e);
		var c = jQuery('#'+fieldName+' .dlf-container');
		
		if (c.is(":visible")) {
			c.hide();
			e.text('(show)');
		}else{
			c.show();
			e.text('(hide)');
		}
		
		return false;
	},
	
	/**
	 * Generate random ID
	 */
	generateID: function(length){
		var text 	 = "";
		var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
		
		for( var i=0; i < length; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
			
		return text;
	}
};
