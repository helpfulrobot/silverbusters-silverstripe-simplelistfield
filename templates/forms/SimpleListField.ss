<textarea $AttributesHTML>$Value</textarea>

<div id="{$ID}_wrapper">
	<div class="field text simplelistfield-heading dlf-heading-wrapper" id="{$ID}_dlf_heading">
		<% if $getAttribute(data-heading) = 1 %>
			<label class="left" for="{$ID}_heading">List heading:</label>
			
			<div class="middleColumn">
				<input type="text" class="text" name="{$ID}_heading" id="{$ID}_heading" placeholder="Heading text of the list" data-holder-id="{$ID}" onblur="SimpleListField.saveToHolder('{$ID}');" />
				
				<button onclick="SimpleListField.add('{$ID}')" class="action action-detail ss-ui-action-constructive ss-ui-button ui-button ui-widget ui-state-default ui-corner-all" data-icon="add">
					<% _t('SimpleListFiled.BTNADD', 'approve this comment') %>
				</button>
			</div>
		<% else %>
			<div style="clear: both">
				<input type="hidden" name="{$ID}_heading" id="{$ID}_heading" data-holder-id="{$ID}" />
				
				<button onclick="SimpleListField.add('{$ID}')" class="action action-detail ss-ui-action-constructive ss-ui-button ui-button ui-widget ui-state-default ui-corner-all" data-icon="add">
					<% _t('SimpleListFiled.BTNADD', 'approve this comment') %>
				</button>
			</div>
		<% end_if %>
	</div>
</div>