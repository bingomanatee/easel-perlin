var weight_item_template;

$(function(){

    _.templateSettings = {
      interpolate : /\{\{(.+?)\}\}/g
    };

    var ct_txt = $('#cell_data_table_row_inner').html()
    var cell_template = _.template(ct_txt);
    $('#cell_data_table_row_inner').html('{{ cells }}');

    var rt_txt = $('#cell_data_table_row').html();
    var row_template = _.template(rt_txt);
    $('#cell_data_table_row').html('');

    var wl_t = ' <tr>  <td>  {{ base }} </td>    <td>  {{ n2 }} </td>  <td> {{rise }} </td>  <td> {{ weight }} </td> </tr>'
    $('angle_row').html('');
    weight_item_template = _.template(wl_t);

    var rows = [];

    for (var r = 0; r < 10; ++r){
        var cells = [];

        for (var c = 0; c < 10; ++c){
            cells.push(cell_template({r: r, c: c}));
        }

        rows.push(row_template({cells: cells.join('\n')}));
    }

    $('#cell_data_table_row').html(rows.join(''));
});

