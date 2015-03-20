<?php
class SimpleListFieldDB extends Text{
	/**
	 * Template
	 */
	private $template = null;
	
	/**
	 * List object
	 */
	private static $listobj = array();
	
	public function __construct($name = null, $options = array()) {
		parent::__construct($name, $options);
	}
	
	/**
	 * Get the list
	 */
	public function getList(){
		// define an unique key
		$key  = $this->name.'_'.md5($this->value);
		
		if( isset(self::$listobj[$key]) ){
			return self::$listobj[$key];
		}
		
		if($this->value){
			self::$listobj[$key] = json_decode($this->value);
		}
		else{
			self::$listobj[$key] = false;
		}
		
		return self::$listobj[$key];
	}
	
	/**
	 * Is Enabled
	 */
	public function isEnabled(){
		$list = $this->getList();
		
		return ( isset($list->enable) && $list->enable );
	}
	
	/**
	 * Count items
	 */
	public function Count(){
		$list = $this->getList();
		
		return ( isset($list->items) && !empty($list->items) ) ? count($list->items) : false;
	}
	
	/**
	 * Get list heading
	 */
	public function getHeading(){
		$list = $this->getList();
		
		if( isset($list->heading) && $list->heading ){
			return Convert::html2raw($list->heading);
		}
		
		return null;
	}
	
	/**
	 * Get list items
	 */
	public function getItems(){
		$list = $this->getList();
		
		if( isset($list->items) && !empty($list->items) )
		{
			$arrayList = new ArrayList();
			
			foreach($list->items as $id => $item){
				$item->ID = $id;
				
				$arrayList->push( new ArrayData($item) );
			}
			
			return $arrayList;
		}
		
		return false;
	}
	
	/**
	 * Set template name (without *.ss extension).
	 * 
	 * @param string $template
	 */
	public function setTemplate($template) {
		$this->template = $template;
		
		return $this;
	}
	
	/**
	 * @return string
	 */
	public function getTemplate() {
		return $this->template;
	}
	
	/**
	 * For template
	 */ 
	public function forTemplate() {
		$list = $this->getList();
		
		if( isset($list->enable) && $list->enable )
		{
			// Get scenario
			$scenario = isset($list->scenario) ? $list->scenario : '';
			
			// Get view file to render
			$template = $this->template ? $this->template : ( $scenario ? 'SimpleListFieldDB_'.$scenario : 'SimpleListFieldDB' );
			$template = new SSViewer($template);
			
			return $template->process($this->customise(new ArrayData(array(
				'FieldName' => $this->name,
				'Heading'   => $this->getHeading(),
				'Items'	    => $this->getItems()
			))));
		}
		
		return false;
	}
}
