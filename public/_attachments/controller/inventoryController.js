var d    = new Date();
var pd_data = {};
app.controller("inventoryController",function($scope,$state,tamsaFactories){
  $.couch.session({
    success: function(data) {
      if(data.userCtx.name == null)
         window.location.href = "index.html";
      else {
        $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
          success: function(data) {
            pd_data = data;
            $scope.level = data.level;
            $scope.$apply();
            tamsaFactories.pdBack();
            displayInventoryManagement();
            inventoryEventBindings();
            tamsaFactories.sharedBindings();
            tamsaFactories.displayDoctorInformation(data);
          },
          error: function(status) {
            console.log(status);
          }
        });
      }
    }
  });
});

function displayInventoryManagement(){
  $(".tab-pane").removeClass("active");
  $("#inv_mgt_tab").addClass("active");
  $("#skipped_rows_parent").hide();
  getInventoryDetails('','','');
}

function getInventoryDetails(selected_category,selected_manf,selected_prod){
  if(selected_category == ''){
    $.couch.db(db).view("tamsa/getInventory", {
      success: function(data){
        if(data.rows.length > 0){
          paginationConfiguration(data,"inventory_pagination",10,getInventory);
        }else{
          var htmldata = [];
          htmldata.push("<tr><td colspan='13' style='text-align:center;'>No data found.</tr>");
          $('#inventory_data').html(htmldata.join(''));
        }        
      },
      error: function(data,error,reason){
        console.log(data);
      },
      startkey : [0,pd_data.dhp_code],
      endkey : [0,pd_data.dhp_code,{},{},{},{},{}],
      include_docs: true,
      reduce : false
    });
  }
  else{
    if(selected_manf != ""){
      if(selected_prod != "") {
        $.couch.db(db).view("tamsa/getInventory", {
          success: function(data){
            paginationConfiguration(data,"inventory_pagination",10,getInventory);
          },
          error: function(data,error,reason){
            console.log(data);
          },
          startkey:[0,pd_data.dhp_code,selected_category,selected_manf,selected_prod],
          endkey:[0,pd_data.dhp_code,selected_category,selected_manf,selected_prod,{},{}],
          include_docs: true,
          reduce : false
        });   
      }else{
        $.couch.db(db).view("tamsa/getInventory", {
          success: function(data){
            paginationConfiguration(data,"inventory_pagination",10,getInventory);
          },
          error: function(data,error,reason){
            console.log(data);
          },
          startkey:[0,pd_data.dhp_code,selected_category,selected_manf],
          endkey:[0,pd_data.dhp_code,selected_category,selected_manf,{},{},{}],
          include_docs: true,
          reduce : false
        }); 
      }
    }else{
      $.couch.db(db).view("tamsa/getInventory", {
      success: function(data){
        paginationConfiguration(data,"inventory_pagination",10,getInventory);
      },
      error: function(data,error,reason){
        console.log(data);
      },
      startkey:[0,pd_data.dhp_code,selected_category],
      endkey:[0,pd_data.dhp_code,selected_category,{},{},{},{}],
      include_docs: true,
      reduce : false
     }); 
    }  
  }
}

function inventoryEventBindings(){
  $("#invcat_table").on("click",".sort_by_category",function(){
    sortInventoryByCategory($(this));
  });
  
  // For Inventory Filter AutoComplete.
  $("#cat_search").autocomplete({
    search: function(event, ui) { 
       $("#cat_search").addClass('myloader');
    },
    source: function( request, response ) {
      var view = "";
      view = "tamsa/getInventory";
      $.couch.db(db).view(view, {
        success: function(data) {
          response(data.rows);
          $("#cat_search").removeClass('myloader');
        },
        error: function(status) {
          console.log(status);
        },
        startkey: [1,pd_data.dhp_code,request.term],
        endkey: [1,pd_data.dhp_code,request.term + "\u9999",{},{},{},{}],
        reduce: true,
        group: true
      });
    },
    focus: function(event, ui) {
      $("#cat_search").val(ui.item.key[2]);
      return false;
    },
    minLength: 1,
    select: function( event, ui ) {
      if(ui.item.key[2] == "No results found"){
        return false;
      }else{
        getInventoryDetails(ui.item.key[2],'','');
        setManufactureName(ui.item.key[2],'','');
        setProdcutName("none",ui.item.key[2],'');
      }      
      return false;
    },
    response: function(event, ui) {
      if (!ui.content.length) {
        var noResult = { key: ['','','No results found'],label:"No results found" };
        ui.content.push(noResult);
      }
    },
    open: function() {
      $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    },
    close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    }
  }).
  data("uiAutocomplete")._renderItem = function(ul, item) {
    return $("<li></li>")
      .data("item.autocomplete", item)
      .append("<a>" + item.key[2] + "</a>")
      .appendTo(ul);
  };

  $("#invcat_table").on("click",".delete_invcat", function() {
    getIndexRevForInventoryDelete($(this));
  });

  $("#invcat_table").on("click","#add_category, .copy_invcat",function(){
    openInventoryModal($(this));    
  });

  $("#delete_invcat_confirm").click(function () {
   deleteInvCate();
  });

  $("#frequent_prod").on("click",function(){
    getFrequentlyPurchaseProducts();
  });

  $("#frequent_products").on("click",".frequant_tr",function(){
    $('#cat_search').val($(this).find('.fcat-name').html());
    setManufactureName($(this).find('.fcat-name').text(),$(this).find('.fprodmanf').text(),$(this).find('.fprodname').text());
  });

  $("#inv_mgt_tab").on("click","#skipped_rows_link",function(){
    downloadSkippedRowsCSV($(this).data("skip_row"))
  });

  $('#inv_mgt_tab').on('click', "#add_cat_finish",function(){
    saveInventoryDetails();
  });

  $('#inv_mgt_tab').on('click', '#wiznext',function(){
    getMoreDetailsAfterCategoryName($(this));
  });

  $("#add_cat_wiz").on("hide.bs.modal",function(){
     clearInventoryModal();
  });

  $('#backcat').click(function(){
    backToCategoryName();
  });

  $('#add_cat_wiz').on('show.bs.modal', function (e) {
    $.fn.modal.Constructor.prototype.enforceFocus = function () { };
  });

  $("#inv_mgt_tab").on("click","#import_products",function(){
    importInventoryFromCSV();
  });
  $("#inv_mgt_tab").on("click",".edit_prod",function(){
    var x = $(this).closest("tr");
    editMode(x);
  });
  $("#inv_mgt_tab").on("click",".save_prod",function(){
    var x = $(this).closest("tr");
    saveMode(x);
  });
 
  $('#filter_manf').change(function(){
    setProdcutName($(this).val(),$('#cat_search').val(),'');
    getInventoryByManufacture($(this).val(),$('#cat_search').val());
  });

  $('#filter_prod').change(function(){
    getFinalInventoryDetails($(this).val(),$('#filter_manf').val(),$('#cat_search').val());
  });

  $('#resetFilter').click(function(){
    resetInventorySearchFilter();
  });
}

function deleteInvCate() {
  if(pd_data.admin){
    if(pd_data.admin.toUpperCase() == "YES"){
      deleteInventoryCategory();
    }else{
      newAlert("danger","You are not Admin.");       
    }
  }else{
    deleteInventoryCategory();
  }
}

function deleteInventoryCategory() {
  var delete_index = $("#delete_invcat_confirm").attr("index");
    var delete_rev   = $("#delete_invcat_confirm").attr('rev');
    var doc = {
      _id: delete_index,
      _rev: delete_rev
    };
    $.couch.db(db).removeDoc(doc, {
      success: function(data) {
        $('#del_cat_wiz').modal("hide");
        newAlert('success', 'Product Deleted successfully !');
        // hide frequently purchase product
        $('#frequent_products').hide();
        $('#frequent_prod').html('<span class="glyphicon glyphicon-plus" id="plus" style="color: rgb(242, 187, 92); font-size: 12px; padding-top: 2px;"></span>Show Frequently Purchase Products');
        $('#fre_title').hide();
        getFrequentlyPurchaseProduct($('#frequent_products'));
        $('#cat_search').val('');
        $('#filter_manf').html('<option>Select Manufacture</option>');
        $('#filter_prod').html('<option>Select Product name</option>');
        $('html, body').animate({scrollTop: 0}, 'slow');
        getInventoryDetails('','','');
      },
      error: function(data, error, reason) {
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    })
}
 
function saveInventoryDetails(){
  if(validateAddInventoryDetails()){
    $.couch.db(db).view("tamsa/getInventory", {
      success: function(data){
        if(data.rows.length > 0){
          newAlertForModal('danger', 'Inventory Already Exist.', 'add_cat_wiz');
        }
        else{
          if($("#note").val() == ''){
            $("#note").val("N/A")
          }
          var add_cat_doc = {
            doctype: "inventory",
            dhp_code:pd_data.dhp_code,
            product_name: $('#product_name').val(),
            manufacturer_name: $('#manf').val(),
            code_no: $('#code').val(),
            lot_no: $('#lot').val(),
            cost: $('#cost').val(),
            price: $('#price').val(),
            quantity_remaining: $('#qty_t').val(),
            quantity_total: $('#qty_t').val(),
            expiry_date: $('#exp_date').val(),
            status: $('#status').val(),
            note: $('#note').val(),
            inventory_added_date: $('#date_add_inv').val(),
            insert_ts : d,
            category: $('#catid').val(),
            doctor_id :  pd_data._id
          };
          $.couch.db(db).saveDoc(add_cat_doc,{
           success: function(data){
            newAlert('success','Category has been added !!!');
            $('html, body').animate({scrollTop: 0}, 'slow');
            $('#frequent_products').hide();
            $('#frequent_prod').html('<span class="glyphicon glyphicon-plus" id="plus" style="color: rgb(242, 187, 92); font-size: 12px; padding-top: 2px;"></span>Show Frequently Purchase Products');
            $('#fre_title').hide();
            if($('#cat_search').val() != ''){
              if($('#filter_manf').val() != 'Select Manufacture') {
                if($('#filter_prod').val() != 'Select Product name') {
                  getInventoryDetails($('#cat_search').val(),$('#filter_manf').val(),$('#filter_prod').val());  
                }else{
                  getInventoryDetails($('#cat_search').val(),$('#filter_manf').val(),'');  
                }
              }else{
                getInventoryDetails($('#cat_search').val(),'','');  
              } 
            }else{
              getInventoryDetails('','','');  
            }
            $("#add_cat_wiz").modal("hide");
            $('#wiznext').show();
            $('#add_cat_finish').hide();
            $('#add_cat_wiz1').show();
            $('#add_cat_wiz2').hide();
           },
           error:function(data){
             console.log(data);
           }
          });
        }
        $('#frequent_products').hide();
        $('#frequent_prod').html('Show Frequently Purchase Products');
        $('#plus').removeClass('glyphicon-minus');
        $('#plus').addClass('glyphicon glyphicon-plus');  
        $('#fre_title').hide();
      },
      error: function(data,error,reason){
        console.log(data);
      },
      key: [0,pd_data.dhp_code,$('#catid').val(),$('#manf').val(),$('#product_name').val(),$('#code').val(),$('#lot').val()],
      reduce : false
    });
  }
}

function clearInventoryModal(){
  $('#product_name').val('');
  $('#manf').val('');
  $('#code').val('');
  $('#lot').val('');
  $('#qty_r').val('');
  $('#qty_t').val('');
  $('#exp_date').val('');
  $('#cost').val('');
  $('#price').val('');
  $('#note').val('');
  $("#status")[0].selectedIndex = 0;
  $('#date_add_inv').val('');
  $('#catid').val('');
  $('#catvalid').html('');
  $('#catvalid_fin').html('');
  $('#addcat').html('');
}

function getFinalInventoryDetails(prod,manf,cat){
  if(prod == 'Select Product name'){
    getInventoryByManufacture(manf,cat);
  }
  else{
    if(manf != "Select Manufacture"){
      $.couch.db(db).view("tamsa/getInventory", {
        success: function(data){
          paginationConfiguration(data,"inventory_pagination",10,getInventory);
        },
        error: function(data,error,reason){
          console.log(data);
        },
        startkey : [0,pd_data.dhp_code,cat,manf,prod],
        endkey : [0,pd_data.dhp_code,cat,manf,prod,{},{}],
        include_docs: true,
        reduce : false
      });
    }
    else{
      $.couch.db(db).view("tamsa/getInventory", {
        success: function(data){
          paginationConfiguration(data,"inventory_pagination",10,getInventory)
        },
        error: function(data,error,reason){
          console.log(data);
        },
        key:[4,pd_data.dhp_code,cat,prod],
        include_docs: true,
        reduce : false
      });
    }
  }
}

function saveEditedInventory($obj){
  $($obj.find(".product_expdate")).html(moment($($obj.find(".edit_product_expdate")).val()).format("YYYY-MM-DD"));
  $($obj.find(".date_add_inventory")).html(moment($($obj.find(".edit_date_add_inventory")).val()).format("YYYY-MM-DD"));
  $.couch.db(db).openDoc($obj.find(".save_prod").attr('index'),{
    success:function(data){
      var newdata = data;
        newdata.product_name         = $($obj.find(".edit_product_name")).val();
        newdata.manufacturer_name    = $($obj.find(".edit_manufacture_name")).val();
        newdata.code_no              = $($obj.find(".edit_product_code")).val();
        newdata.lot_no               = $($obj.find(".edit_product_lot")).val();
        newdata.cost                 = $($obj.find(".edit_product_cost")).val();
        newdata.price                = $($obj.find(".edit_product_price")).val();
        newdata.quantity_remaining   = $($obj.find(".edit_remaning_qty")).val();
        newdata.quantity_total       = $($obj.find(".edit_total_qyt")).val();
        newdata.expiry_date          = $($obj.find(".product_expdate")).html();
        newdata.status               = $($obj.find(".edit_product_status")).val();
        newdata.note                 = $($obj.find(".edit_product_note")).val();
        newdata.inventory_added_date = $($obj.find(".date_add_inventory")).html();
        newdata.category             = $($obj.find(".edit_category_name")).val();
        newdata.doctor_id            = pd_data._id;
        newdata.update_ts            = d;
      $.couch.db(db).saveDoc(newdata,{
        success: function(data){
          $($obj.find(".save_prod")).attr('rev',data.rev);
          $($obj.find(".delete_invcat")).attr('rev',data.rev);
          newAlert('success','Inventory has been updated !!!');
          $('#frequent_products').hide();
          $('#frequent_prod').html('<span class="glyphicon glyphicon-plus" id="plus" style="color: rgb(242, 187, 92); font-size: 12px; padding-top: 2px;"></span>Show Frequently Purchase Products');
          $('#fre_title').hide();
          $($obj.find('.category_name')).html($($obj.find(".edit_category_name")).val());
          $($obj.find('.manufacture_name')).html($($obj.find(".edit_manufacture_name")).val());
          $($obj.find('.product_code')).html($($obj.find(".edit_product_code")).val());
          $($obj.find('.remaining_total')).html($($obj.find(".edit_remaning_qty")).val()+"/"+$($obj.find(".edit_total_qyt")).val());
          $($obj.find('.product_lot')).html($($obj.find(".edit_product_lot")).val());
          $($obj.find('.product_price')).html($($obj.find(".edit_product_price")).val());
          $($obj.find('.product_name')).html($($obj.find(".edit_product_name")).val());
          $($obj.find('.product_cost')).html($($obj.find(".edit_product_cost")).val());
          $($obj.find('.product_note')).html($($obj.find(".edit_product_note")).val());
          $($obj.find('.product_status')).html($($obj.find(".edit_product_status")).val());
          $($obj.find(".edit_prod")).show()
          $($obj.find(".save_prod")).hide();
          $($obj.find('.delete_invcat')).css('pointer-events','unset');
          $($obj.find('.copy_invcat')).css('pointer-events','unset');
        },
        error:function(data){
          console.log(data);
        }
      });   
    },
    error:function(data,error,reason){
      console.log(data);
    }
  })
}
function editMode(x){
  //var x = $ind.closest("tr");
  x.find(".edit_prod").data({
    category_name: $(x.find('.category_name')).html().replace(/&amp;/g, '&'),
    product_name : $(x.find('.product_name')).html().replace(/&amp;/g, '&'),
    manufacture_name : $(x.find('.manufacture_name')).html().replace(/&amp;/g, '&'),
    product_code : $(x.find('.product_code')).html(),
    product_lot : $(x.find('.product_lot')).html()
  });
  $(x.find('.delete_invcat')).css('pointer-events','none');
  $(x.find('.copy_invcat')).css('pointer-events','none');
  $(x.find(".category_name")).html('<input type="text" value="'+x.find(".category_name").html()+'" class="form-control edit_category_name">');
  $(x.find(".product_name")).html('<input type="text" value="'+x.find(".product_name").html()+'" class="form-control edit_product_name">');
  $(x.find(".manufacture_name")).html('<input type="text" value="'+x.find(".manufacture_name").html()+'" class="form-control edit_manufacture_name">');
  $(x.find(".product_code")).html('<input type="text" value="'+$(x.find(".product_code")).html()+'" class="form-control edit_product_code">');  
  $(x.find(".remaining_total")).html('<input type="text" value="'+$(x.find(".remaning_qty")).html()+'" class="form-control editqty_num edit_remaning_qty"><span style=" float: left;margin-left: 5px;margin-right: 5px;margin-top: 4px;"> / </span><input type="text" value="'+$(x.find(".total_qyt")).html()+'" class="form-control editqty_num edit_total_qyt">');
  $(x.find(".product_lot")).html('<input type="text" value="'+$(x.find(".product_lot")).html()+'" class="form-control edit_product_lot">');  
  $(x.find(".product_expdate")).html('<input type="text" class="datetime-with-mintoday edit_date" value="'+$(x.find(".product_expdate")).html()+'" class="form-control edit_product_expdate">');  
  $(x.find(".product_cost")).html('<input type="text" value="'+$(x.find(".product_cost")).html()+'" class="form-control edit_product_cost">');  
  $(x.find(".date_add_inventory")).html('<input type="text" class="datetime-with-mintoday edit_date" value="'+$(x.find(".date_add_inventory")).html()+'" class="form-control edit_date_add_inventory">');
  $(x.find(".product_price")).html('<input type="text" value="'+$(x.find(".product_price")).html()+'" class="form-control edit_product_price">'); 
  $(x.find(".product_note")).html('<input type="text" value="'+$(x.find(".product_note")).html()+'" class="form-control edit_product_note">'); 
  if($(x.find(".product_status")).html() == 'Active'){  
  $(x.find(".product_status")).html('<select class="form-control editstatusclass edit_product_status"><option>Active</option><option>Inactive</option></select>');  
  }else{
     $(x.find(".product_status")).html('<select class="form-control editstatusclass edit_product_status"><option>Inactive</option><option>Active</option></select>');  
  }
  $(x.find(".edit_prod")).hide()
  $(x.find(".save_prod")).show();
}

function saveMode($obj){
  $($obj.find('.delete_invcat')).css('pointer-events','none');
  $($obj.find('.copy_invcat')).css('pointer-events','none');
  if(validateEditInventoryDetails($obj)){
    $.couch.db(db).view("tamsa/getInventory", {
      success: function(data){
        if($obj.find('.edit_category_name').val() == $obj.find(".edit_prod").data("category_name") && $obj.find('.edit_product_name').val() == $obj.find(".edit_prod").data("product_name") && $obj.find('.edit_product_code').val() == $obj.find(".edit_prod").data("product_code") && $obj.find('.edit_product_lot').val() == $obj.find(".edit_prod").data("product_lot") && $obj.find('.edit_manufacture_name').val() == $obj.find(".edit_prod").data("manufacture_name")){
          saveEditedInventory($obj);
        }else{  
          if(data.rows.length > 0){
            newAlert("danger", "Inventory Already Exist.");
            $('html, body').animate({scrollTop: $("#inv_mgt_tab").offset().top - 100}, 1000);
            return false;
          }else{
              saveEditedInventory($obj);
          }
        }  
      },
      error: function(data,error,reason){
        console.log(data);
      },
      key: [0,pd_data.dhp_code,$($obj.find(".edit_category_name")).val(),$($obj.find(".edit_manufacture_name")).val(),$($obj.find(".edit_product_name")).val(),$($obj.find(".edit_product_code")).val(),$($obj.find(".edit_product_lot")).val()],
      reduce : false
    });
  }
}

function getInventory(start,end,data){
  var htmldata=[];
   for (var i=start; i<end; i++) {
      htmldata.push('<tr>');
      htmldata.push('<td class="category_name">'+data.rows[i].doc.category+'</td><td class="product_name">'+data.rows[i].doc.product_name+'</td>'+'<td class="manufacture_name">'+data.rows[i].doc.manufacturer_name+'</td><td class="product_code">'+data.rows[i].doc.code_no+'</td><td class="product_lot">'+data.rows[i].doc.lot_no+'</td><td class="prodqtyr remaning_qty">'+data.rows[i].doc.quantity_remaining+'</td><td class="prodqtyt total_qyt">'+data.rows[i].doc.quantity_total+'</td><td class="remaining_total">'+data.rows[i].doc.quantity_remaining+'/'+data.rows[i].doc.quantity_total+'</td><td class="product_expdate">'+moment(data.rows[i].doc.expiry_date).format("YYYY-MM-DD")+'</td><td class="product_cost">'+data.rows[i].doc.cost+'</td><td class="product_price">'+data.rows[i].doc.price+'</td><td class="product_status">'+data.rows[i].doc.status+'</td><td class="product_note">'+data.rows[i].doc.note+'</td><td class="date_add_inventory">'+moment(data.rows[i].doc.inventory_added_date).format("YYYY-MM-DD")+'</td><td><button data-toggle="modal" class="glyphicon glyphicon-pencil edit_prod" index=""></button><button data-toggle="modal" class="glyphicon glyphicon-saved save_prod" index="'+data.rows[i].id+'" rev="'+data.rows[i].doc._rev+'"></button><span data-toggle="modal" role="button" text="" class="glyphicon copy_invcat" id="" style="margin:0;" index="'+data.rows[i].id+'"><img src="images/copy.png" style="height: 17px; margin-right: 6px;"></span><span data-toggle="modal" role="button" data-target="#del_cat_wiz" text="Family History" class="glyphicon glyphicon-trash delete_invcat" index="'+data.rows[i].id+'" rev="'+data.rows[i].doc._rev+'" style="margin-top:5px;"></span></td>');
      htmldata.push('</tr>');
    }
  $('#inventory_data').html(htmldata.join(''));
}

function openInventoryModal($obj){
  var x = $obj.closest("tr");
  $("#add_cat_wiz").modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });

  $('#add_cat_finish').hide();
  $('#add_cat_wiz2').hide();
  $('#add_cat_wiz1').show();
  $('#wiznext').show();
  if(($obj).attr("id") != "add_category"){
    $("#catid").val(x.find(".category_name").html());
    $("#product_name").val(x.find(".product_name").html());
    $("#manf").val(x.find(".manufacture_name").html());
    $("#code").val(x.find(".product_code").html());
    $("#qty_r").val(x.find(".remaning_qty").html());
    $("#qty_t").val(x.find(".total_qyt").html());
    $("#lot").val(x.find(".product_lot").html());
    $("#exp_date").val(x.find(".product_expdate").html());
    $("#cost").val(x.find(".product_cost").html());
    $("#price").val(x.find(".product_price").html());
    $("#status").val(x.find(".product_status").html());
    $("#note").val(x.find(".product_note").html());
    $("#date_add_inv").val(x.find(".date_add_inventory").html());
    $('#addcat').html(x.find(".category_name").html());
  }
}

function setProdcutName(manuf,cat,val1){
  if(manuf == "none"){
    $.couch.db(db).view("tamsa/getInventory", {
      success: function(data){
      var selectHTML = [];
        for(var i=0;i<data.rows.length;i++){
          selectHTML.push("<option>"+data.rows[i].key[3]+"</option>");
        }
        $('#filter_prod').html("<option>Select Product name</option>"+selectHTML.join(''));
      },
      error: function(data,error,reason){
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      startkey:[4,pd_data.dhp_code,cat],
      endkey:[4,pd_data.dhp_code,cat,{}],
      reduce : true,
      group:true
    }); 
  }
  else{
    $.couch.db(db).view("tamsa/getInventory", {
      success: function(data){
      var selectHTML = [];
        for(var i=0;i<data.rows.length;i++){
          selectHTML.push("<option>"+data.rows[i].key[4]+"</option>");
        }
        $('#filter_prod').html("<option>Select Product name</option>"+selectHTML.join(''));
        if(val1 != ''){
          $('#filter_prod').val(val1);
          $('#filter_prod').trigger('change');
        }
      },
      error: function(data,error,reason){
        newAlert('error', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      startkey:[3,pd_data.dhp_code,cat,manuf],
      endkey:[3,pd_data.dhp_code,cat,manuf,{}],
      reduce : true,
      group:true
    });  
  }
}

function setManufactureName(category_name,value,val2){
 $.couch.db(db).view("tamsa/getInventory", {
    success: function(data){
      var val = "";
      var selectHTML = [];
      for(var i=0;i<data.rows.length;i++){
          selectHTML.push("<option>"+data.rows[i].key[3]+"</option>");
      }
      $('#filter_manf').html("<option>Select Manufacture</option>"+selectHTML.join(''));
      if(value != ''){
        $('#filter_manf').val(value);
        setProdcutName($('#filter_manf').val(),category_name,val2);
        getInventoryByManufacture($('#filter_manf').val(),category_name);
      }
    },
    error: function(data,error,reason){
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    },
    startkey:[2,pd_data.dhp_code,category_name],
    endkey:[2,pd_data.dhp_code,category_name,{}],
    reduce : true,
    group:true
  });  
}

function getInventoryByManufacture(manuf,cat){
  if(manuf == "Select Manufacture"){
    getInventoryDetails(cat,'','');
  }else{
    $.couch.db(db).view("tamsa/getInventory", {
      success: function(data){
        paginationConfiguration(data,"inventory_pagination",10,getInventory)
      },
      error: function(data,error,reason){
        console.log(data);
      },
      startkey : [0,pd_data.dhp_code,cat,manuf],
      endkey : [0,pd_data.dhp_code,cat,manuf,{},{},{}],
      include_docs: true,
      reduce:false
    });
  }
}

function resetInventorySearchFilter(){
  getInventoryDetails('','','');
  $('#cat_search').val('');
  $('#filter_manf').html('<option>Select Manufacture</option>');
  $('#filter_prod').html('<option>Select Product name</option>');
  $(".sort_by_category").removeClass("theme-color");
}

function backToCategoryName (){
  $('#wiznext').show();
  $('#add_cat_finish').hide();
  $('#add_cat_wiz1').show();
  $('#add_cat_wiz2').hide();
}

function getMoreDetailsAfterCategoryName($obj){
  if($('#catid').val() != ''){
    $obj.hide();
    $('#add_cat_finish').show();
    $('#add_cat_wiz1').hide();
    $('#add_cat_wiz2').show();
    $('#addcat').html($('#catid').val());
  }
  else{
    newAlertForModal('danger', 'Please enter Category Name.', 'add_cat_wiz');
    return false;
  }
}

function getIndexRevForInventoryDelete($obj){
  $("#delete_invcat_confirm").attr("index",$obj.attr("index"));
  $("#delete_invcat_confirm").attr("rev",$obj.attr("rev"));
}

function getFrequentlyPurchaseProduct($ele){
  $.couch.db(db).list("tamsa/sortValues", "getFrequentlyPurchasedProducts", {
    startkey:[pd_data.dhp_code,{},{},{}],
    endkey:[pd_data.dhp_code],
    reduce:true,
    group:true,
    descending:true
  }).success(function(data){
    var frequent_products_data = [];
    frequent_products_data.push('<table id="fre_invcat_table" class="table tbl-border widthset fre_invcat_table"><thead><tr><th width="11%">Category</th><th width="12%">Product Name</th><th width="10%">Manufacture</th></tr></thead><tbody id="fre_inventory_data">');
    if(data.rows.length > 0){
      var len = data.rows.length > 5 ? 5 : data.rows.length; 
      for(var i=0; i<len; i++) {
        //frequent_products_data.push('<tr id="fcat'+i+'" onclick="setFilterByFrequantPurchase('+i+');">');
        frequent_products_data.push('<tr class="frequant_tr">');
        frequent_products_data.push('<td class="fcat-name">'+data.rows[i].key[1]+'</td><td class="fprodname" id="fpname'+i+'">'+data.rows[i].key[3]+'</td>'+'<td class="fprodmanf " id="fmanf'+i+'">'+data.rows[i].key[2]+'</td>');
        frequent_products_data.push('</tr>');
      }
      frequent_products_data.push('</tbody></table>');
      $ele.html(frequent_products_data.join(''));
    }else{
      frequent_products_data.push('<tr><td colspan="3" style="text-align:center;">No data found.</tr></tbody></table>');
      $ele.html(frequent_products_data.join(''));
    }
  });
}

function isAPIAvailable() {
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    return true;
  } else {
    newAlert(danger,'The HTML5 APIs used in this form are only available in the following browsers.');
    // // 6.0 File API & 13.0 <output>
    // newAlert(danger,' - Google Chrome: 13.0 or later<br />');
    // // 3.6 File API & 6.0 <output>
    // newAlert(danger,' - Mozilla Firefox: 6.0 or later<br />');
    // // 10.0 File API & 10.0 <output>
    // newAlert(danger,' - Internet Explorer: Not supported (partial support expected in 10.0)<br />');
    // // ? File API & 5.1 <output>
    // newAlert(danger,' - Safari: Not supported<br />');
    // // ? File API & 9.2 <output>
    // newAlert(danger,' - Opera: Not supported');
    return false;
  }
}

function importInventoryFromCSV() {
  if($("#product_csv_file").val()){
    var fileobj = $("#product_csv_file").prop("files")[0];
    if(fileobj.name.slice(-3) == 'csv'){
      getInventoryDetailsFromCSV(fileobj);
    }else{
      newAlert("danger","Importing File is not CSV.Please select CSV File");
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  }else{
    newAlert('danger', "No File is selected for Import.");
    $('html, body').animate({scrollTop: 0}, 'slow');
  }
}

function getInventoryDetailsFromCSV(fileobj) {
  var reader = new FileReader();
  reader.readAsText(fileobj);
  reader.onload = function(event){
    var csv = event.target.result;
    var data = $.csv.toArrays(csv);
    //var data = $.csv.toObjects(csv);
    if(validateImportInventoryDetails(data)){
      var bulk_products = [];
      var skip_products = [];
      $("#import_products").data("total_rows",data.length -1);
      for(var i=1;i<data.length;i++){
        validateExistingInventoryDetailsFromCSV(data,i,bulk_products,skip_products);
      }
    }else{
      return false;
    }
    
  };
  reader.onerror = function(){ alert('Unable to read ' + fileobj.name); };
}

function validateImportInventoryDetails(data){
  if(data.length == 0 || data.length == 1){
    newAlert('danger', "Invalid CSV file. Please import valid csv file.");
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }else if(data[0][0] != "Category" || data[0][1] != "Product" || data[0][2]  != "Manf" || data[0][3]  != "Code (8 digit max)" || data[0][4]  != "Lot (8 digit max)" || data[0][5]  != "Qty (Remaining/ Total)" || data[0][6]  != "Expiration Date (DD/MM/YYYY)" || data[0][7]  != "Cost" || data[0][8]  != "Price" || data[0][9]  != "Status" || data[0][10]  != "Notes" || data[0][11]  != "Date Added to Inv (DD/MM/YYYY)"){
    newAlert('danger', "Invalid CSV file. Please import valid csv file.");
    $('html, body').animate({scrollTop: 0}, 'slow');
    return false;
  }else{
    return true;
  } 
}

function validateExistingInventoryDetailsFromCSV(data,i,bulk_products,skip_products){
  if(data[i][0] == "" || data[i][1] == "" || data[i][2] == "" || data[i][3]  == "" || data[i][4]  == "" || data[i][5]  == "" || data[i][6] == "" || data[i][7] == "" || data[i][8] == "" || data[i][9] == "" || data[i][11] == ""){
    data[i].push("One of the Required filed is Blank.");
    skip_products.push(data[i]);
    $("#import_patient").data("total_rows",$("#import_patient").data("total_rows")-1);
    if($("#import_patient").data("total_rows") == "0"){
      saveInventoryDetailsFromCSV(bulk_products,skip_products);
    }
  }else if(i!= 1){
    for(var j=i-1;j>0;j--){
      if(data[j][0] == data[i][0] && data[j][1] == data[i][1] && data[j][2] == data[i][2] && data[j][3] == data[i][3] && data[j][4] == data[i][4]){
        var error = true;
        break;
      }
    }
    if(error){
      data[i].push("Inventory Already Exists within importing File.")
      skip_products.push(data[i]);
      $("#import_patient").data("total_rows",$("#import_patient").data("total_rows")-1);
      if($("#import_patient").data("total_rows") == "0"){
        saveInventoryDetailsFromCSV(bulk_products,skip_products);
      }
    }else{
      validationForAlreadyExistsInventoryInDB(data,i,bulk_products,skip_products);
    }
  }else{
    validationForAlreadyExistsInventoryInDB(data,i,bulk_products,skip_products);
  }
}

function validationForAlreadyExistsInventoryInDB(data,i,bulk_products,skip_products){
  $.couch.db(db).view("tamsa/getInventory", {
    success: function(udata){
      if(udata.rows.length > 0){
        data[i].push("Inventory already exists.");
        skip_products.push(data[i]);
      }else{
        var add_cat_doc = {
          doctype:              "inventory",
          category:             data[i][0],
          product_name:         data[i][1],
          manufacturer_name:    data[i][2],
          code_no:              data[i][3],
          lot_no:               data[i][4],
          quantity_remaining:   data[i][5].split("/")[0],
          quantity_total:       data[i][5].split("/")[1],
          expiry_date:          data[i][6],
          cost:                 data[i][7],
          price:                data[i][8],
          status:               data[i][9],
          note:                 data[i][10],
          inventory_added_date: data[i][11],
          insert_ts:            d,
          dhp_code:             pd_data.dhp_code,
          doctor_id:            pd_data._id
        };
        bulk_products.push(add_cat_doc);
      }
      $("#import_products").data("total_rows",$("#import_products").data("total_rows")-1);
      if($("#import_products").data("total_rows") == "0"){
        saveInventoryDetailsFromCSV(bulk_products,skip_products);
      }
    },
    error: function(data,error,reason){
      console.log(data);
    },
    key: [0,pd_data.dhp_code,data[i][0],data[i][2],data[i][1],data[i][3],data[i][4]],
    reduce : false
  });
}

function saveInventoryDetailsFromCSV(bulk_products,skip_products){
  if(bulk_products.length > 0){
    $.couch.db(db).bulkSave({"docs":bulk_products},{
      success:function(data){
        if(skip_products.length > 0){
          $("#skipped_rows_parent").show();
          $("#skipped_rows_link").data("skip_row",skip_products);
          newAlert('warning', "Inventory partially imported with skipped Rows.");
        }else{
          $("#skipped_rows_parent").hide();
          $("#skipped_rows_link").data("skip_row","");
          newAlert('success', "Inventory successfully Imported.");
        }
        getInventoryDetails('','','');
        $("#product_csv_file").val("");
        $('html, body').animate({scrollTop: 0}, 'slow');
        
      },
      error:function(data,error,reason){
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');       
      }
    });    
  }else{
    if(skip_products.length > 0){
      $("#skipped_rows_parent").show();
      $("#skipped_rows_link").data("skip_row",skip_products);
      newAlert('danger', "Inventory Details are invalid.");
    }else{
      $("#skipped_rows_parent").hide();
      $("#skipped_rows_link").data("skip_row","");
      newAlert('danger', "No Inventory Details are found in importing File.");
    }
    getInventoryDetails('','','');
    $("#product_csv_file").val("");
    $('html, body').animate({scrollTop: 0}, 'slow');
  }
}

function downloadSkippedRowsCSV(skipped_products){
  var header = ["Category","Product","Manf","Code (8 digit max)","Lot (8 digit max)","Qty (Remaining/ Total)","Expiration Date (DD/MM/YYYY)","Cost","Price","Status","Notes","Date Added to Inv (DD/MM/YYYY)","Reason For Skip"];
  skipped_products.unshift(header);
  var csvContent = "data:text/csv;charset=utf-8,";
  skipped_products.forEach(function(infoArray, index){
     dataString = infoArray.join(",");
     csvContent += index < skipped_products.length ? dataString+ "\n" : dataString;
  });
  var encodedUri = encodeURI(csvContent);
  $("#skipped_rows_link").attr("href",encodedUri);
  $("#skipped_rows_link").attr("download", "error.csv");
  $("#skipped_rows_parent").hide();
}

function getFrequentlyPurchaseProducts(){
  $('#frequent_products').slideToggle("slow");
  if($('#plus').hasClass('glyphicon-minus')){
    $('#plus').removeClass('glyphicon-minus').addClass('glyphicon-plus');
  }else{
    $('#plus').removeClass('glyphicon-plus').addClass('glyphicon-minus');
  }
  if($('#frequent_prod').html().indexOf('Show') != -1){
    $('#frequent_prod').html('<span class="glyphicon glyphicon-minus" id="plus" style="color: rgb(242, 187, 92); font-size: 12px; padding-top: 2px;"></span>Hide Frequently Purchase Products');
    $('#fre_title').show();
    getFrequentlyPurchaseProduct($('#frequent_products'));
  }else{
    $('#frequent_prod').html('<span class="glyphicon glyphicon-plus" id="plus" style="color: rgb(242, 187, 92); font-size: 12px; padding-top: 2px;"></span>Show Frequently Purchase Products');
    $('#fre_title').hide();
  }
}

function sortInventoryByCategory($obj) {
  var sorting_parameter = $obj.data("sorting_parameter"),
      sort_order = $obj.data("sort_order"),
      start_key,
      end_key,
      descending_val; 
  if(sort_order == "descending") {
    start_key = [sorting_parameter,pd_data.dhp_code, {}];
    end_key = [sorting_parameter,pd_data.dhp_code];
    descending_val = true;
    $obj.data("sort_order", "ascending");
  }else {
    start_key = [sorting_parameter,pd_data.dhp_code];
    end_key = [sorting_parameter,pd_data.dhp_code,{}];
    descending_val = false;
    $obj.data("sort_order", "descending");
  }
  $(".sort_by_category").removeClass("theme-color");
  $obj.addClass("theme-color");
  $(".sort_by_category").not($obj).data("sort_order","ascending");

  $.couch.db(db).list("tamsa/getInventorySortedByColumn", "getInventoryDetailsFromLotNo", {
  startkey:[pd_data.dhp_code],
  endkey:[pd_data.dhp_code, {}],
  include_docs:true,
  reduce:false,
  sorting_parameter:sorting_parameter,
  sort_order: sort_order
  }).success(function(data){
    if(data.rows.length > 0){
      paginationConfiguration(data,"inventory_pagination",10,getInventory);
    }else{
      console.log("in else");
    }
  });
}