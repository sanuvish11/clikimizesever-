<?php 
header('Access-Control-Allow-Origin: *');
include('apiservices.php');
$data=getAllTemplate();
 $results=json_decode($data);
print_r(json_encode($data));
/*
?>
<!--  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
   <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
 <link rel="stylesheet" href="style.css">
  <div class="container">
    <div class="well well-sm">
       
    </div>
    <div id="products" class="row list-group">
   -->
   <?php
    		if(!empty($results))
    		{
    			foreach ($results as $key => $value) {
    			?>
    			 <div class="item  col-xs-4 col-lg-4">
		            <div class="thumbnail">
		                <img class="group list-group-image" src="<?php echo $value->thumbnail_url; ?>" alt="" style="width: 358px; height: 228px;" />
		                <div class="caption">
		                    <h4 class="group inner list-group-item-heading">
		                        <?php echo $value->template_name; ?></h4>
		                   
		                    <div class="row">
		                      
		                        <div class="col-xs-12 col-md-6">
		                        	<a href="<?php echo $value->preview_url; ?>" target="_blank" class="btn btn-success">Preview</a>
		                        	 <a class="btn btn-success" data-toggle="modal" onclick="start_site('<?php echo $value->template_id; ?>','<?php echo $value->thumbnail_url; ?>','<?php echo $value->template_name; ?>')" >Start</a>
		                        </div>
		                    </div>
		                </div>
		            </div>
			     </div>
    			<?php	
    			}
    		}

    	 ?>
       
       
        
    </div>
</div>

<!-- Modal -->
<div id="myModal" class="modal fade" role="dialog">
  <div class="modal-dialog modal-lg">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <!-- <h4 class="modal-title">Modal Header</h4> -->
      </div>
      <div class="modal-body">
      	<div id="creatediv" class="row"></div>
       <div class="row" id="formdiv">
       	<div class="col-md-7">
       		<h3 style="font-size: 20px;margin-top: 5px;">Start with the Accountant template?</h3>
       		<div style="width: 100%">
       			<img src="" id="templateUrl" style="width: 100%;">
       		</div>
       	</div>
       	<div class="col-md-5">
       		<h4 style="font-size: 15px;">Enter your info below to create your free account.</h4>
       		<div >
       			<form name="myForm" id="myForm" onsubmit="return create_website()">
					  <div class="form-group">
					  	<input type="hidden" name="template_id" id="template_id">
					  	<input type="hidden" name="SWU" value="false">
					  	 <input type="hidden" id="template_name"  name="template_name" value="">
					  	<input type="hidden" id="siteName-8" name="siteName" value="clickimize">
                        <input type="hidden"  name="editor" value="builder.clickimize.com">
						<label for="email">Email<span style="color:red;">*</span>:</label>
					    <input type="email" class="form-control" placeholder="Your E-mail" id="email" name="email" required="required">
					  </div>
					  <div class="form-group">
					    <label for="pwd">Name<span style="color:red;">*</span>:</label>
					    <input type="text" name="name" class="form-control"  placeholder="Your Name" required="required">
					  </div>
					  <div class="form-group">
					    <label for="pwd">Phone:</label>
					    <input type="text" name="phone" class="form-control" placeholder="Your Phone Number">
					  </div>
					  <div class="form-group">
					    <label for="pwd">Have a website already?</label>
					    <select class="form-control" id="websitestatus" name="websitestatus">
					    	<option value="No">No</option>
					    	<option value="Yes">Yes</option>
					    </select>
					    
					  </div>
					   <div class="form-group" id="websitediv" style="display: none;">
					    <label for="pwd">Website<span style="color:red;">*</span>:</label>
					     <input type="text"  class="form-control" name="website" placeholder="Current Website URL"  oninvalid="this.setCustomValidity('Please Provide Valid URL')" oninput="setCustomValidity('')" pattern="^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$">
					  </div>
					  <button type="submit" class="btn btn-default">Submit</button>
					</form>
       		</div>
       	</div>
       </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>

  </div>
</div>

<script type="text/javascript">
function start_site(templateId,src,templateName)
{
  $('#formdiv').show();
  $('#creatediv').html('');
  $("input[type=text], input[type=email]").val("");
  $('#template_id').val(templateId);
  $('#template_name').val(templateName);
  $('#templateUrl').attr('src', src);
  $('#myModal').modal('show');
}
$('#websitestatus').on('change', function(event) {
	$('#websitediv').hide();
	if($(this).val()=='Yes')
	{
		$('#websitediv').show();
	}
});

function create_website()
{
	 $('#creatediv').html('');
     var loading = `
          <div id="loading" style="text-align: center;">
            <h4 id="loading-text" style="color: #000; margin-top: 1em; font-size: 1.5em !important;">
              Creating Your Site, Please Wait...
            </h4>
            <div id="floatingCirclesG">
              <div class="f_circleG" id="frotateG_01"></div>
              <div class="f_circleG" id="frotateG_02"></div>
              <div class="f_circleG" id="frotateG_03"></div>
              <div class="f_circleG" id="frotateG_04"></div>
              <div class="f_circleG" id="frotateG_05"></div>
              <div class="f_circleG" id="frotateG_06"></div>
              <div class="f_circleG" id="frotateG_07"></div>
              <div class="f_circleG" id="frotateG_08"></div>
            </div>
          </div>`;
          $('#creatediv').html(loading);
          $('#formdiv').hide();
	$.ajax({
		url: 'api.php',
		type: 'POST',
		data: $('#myForm').serialize(),
	})
	.done(function(data) {
		window.location='https://builder.clickimize.com/home/site/'+data+'/home';
	})
	;
	return false;
}
</script>
*/
?>