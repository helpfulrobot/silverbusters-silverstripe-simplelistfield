<div id="$Name" class="field<% if $extraClass %> $extraClass<% end_if %> simplelistfield-container">
	
	<h4 class="dlf-heading">
		<% if $Title %><label for="$ID">$Title</label><% end_if %>
		
		<a href="#" onclick="return SimpleListField.toggle(this, '{$Name}')" class="dlf-toggle">(show)</a>
		
		<span class="dlf-switch-state">
			<input type="checkbox" name="{$ID}_state" id="{$ID}_state" checked="checked" onclick="SimpleListField.saveToHolder('{$ID}')" /> Enable
		</span>
	</h4>
	
	<div class="dlf-messages">
		<% if $RightTitle %><label class="right" for="$ID">$RightTitle</label><% end_if %>
		<% if $Message %><span class="message $MessageType">$Message</span><% end_if %>
		<% if $Description %><span class="description">$Description</span><% end_if %>
	</div>
	
	<div class="dlf-container hide">
		$Field
	</div>
</div>
