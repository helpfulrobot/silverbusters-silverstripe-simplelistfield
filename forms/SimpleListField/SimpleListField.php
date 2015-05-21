<?php
class SimpleListField extends TextareaField {
	/**
	 * List of Scenarios
	 */
	private static $scenarios = array();
	
	/**
	 * Scenario to use
	 */
	private $scenario = null;
	
	/*
	 *
	 */
	public function Field($properties = array()) {
		// Load TinyMCE if needed
		if( isset(self::$scenarios[$this->scenario]['fields']) ){
			$fields = self::$scenarios[$this->scenario]['fields'];
			
			foreach($fields as $field){
				if(isset($field['type']) && $field['type'] == 'htmleditor'){
					HtmlEditorField::include_js(); break;
				}
			}
		}
		
		// Assets
		Requirements::css(SimpleListFieldDir . '/forms/SimpleListField/css/SimpleListField.css');
		Requirements::javascript(SimpleListFieldDir . '/forms/SimpleListField/js/jquery.serializejson.min.js');
		Requirements::javascript(SimpleListFieldDir . '/forms/SimpleListField/js/SimpleListField.js');
		
		// Set attributes
		$this->setAttribute('type', 'hidden');
		$this->addExtraClass('hide');
		
		if($this->scenario)
		{
			$this->setAttribute('data-scenario', (string)$this->scenario);
			
			// heading
			if(( isset(self::$scenarios[$this->scenario]['heading']) && !self::$scenarios[$this->scenario]['heading'] ))
				$this->setAttribute('data-heading', 0);
			else
				$this->setAttribute('data-heading', 1);
			
			// fields
			if( isset(self::$scenarios[$this->scenario]['fields'])
				&& self::$scenarios[$this->scenario]['fields']
				&& is_array(self::$scenarios[$this->scenario]['fields']) ){
				$this->setAttribute('data-fields', json_encode(self::$scenarios[$this->scenario]['fields']));
			}
			
		}
		
		// Render the fields
		return $this->customise($properties)->renderWith($this->getTemplates());
	}
	
	/**
	 * Field type
	 */ 
	public function Type() {
		return 'text simplelist';
	}
	
	/**
	 * Set scenarios
	 */
	public function setScenarios($scenarios = array()){
		self::$scenarios = $scenarios;
		
		return $this;
	}
	
	/**
	 * Set scenarios
	 */
	public static function staticSetScenarios($scenarios = array()){
		self::$scenarios = $scenarios;
	}
	
	/**
	 * Get scenarios
	 */
	public function getScenarios($key = null){
		return self::$scenarios;
	}
	
	/**
	 * Add single scenario
	 */
	public function addScenario($scenario = array()){
		array_push(self::$scenarios, $scenario);
		
		return $this;
	}
	
	/**
	 * Set Scenario to use
	 */
	public function useScenario($scenarioName = null){
		$this->scenario = $scenarioName;
		return $this;
	}
}
