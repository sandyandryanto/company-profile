<?php

namespace App\Http\Controllers\Main;

use App\Http\Controllers\AppController;
use Illuminate\Http\Request;
// load models
use App\Models\Faq;
use App\Models\CategoryFaq;

class FaqController extends AppController{

    public function categories(){
        $data = CategoryFaq::where("id", "<>", 0)
            ->select(["id as code", "name as label"])
            ->orderBy("name")
            ->get();
        return response()->json($data);
    }


    public function list(Request $request){
        $postData = $request->all();
        $data = Faq::getAllData($postData);
        return response()->json($data);
    }

    public function create(Request $request){

        $data = new Faq;
        $data->question = $request->get("question");
        $data->answer = $request->get("answer");
        $data->category_id = $request->get("category_id");

        if($request->get("sort")){
            $data->sort = $request->get("sort");
        }

        $data->is_published = $request->get("is_published") ? $request->get("is_published") : 0;
        $data->save();
        $response = array(
            "message"=> "Data has been created !",
            "data"=> $data
        );
        return response()->json($response);

    }

    public function detail($id){

        $data = Faq::where("id", $id)->first();
        if(is_null($data)){
            return abort(404);
        }

        $data->category = CategoryFaq::where("id", $data->category_id)->first();

        $response = array(
            "message"=> "Data has been founded !",
            "data"=> $data
        );
        return response()->json($response);
    }

    public function update($id, Request $request){

        $data = Faq::where("id", $id)->first();

        if(is_null($data)){
            return abort(404);
        }

        $data->question = $request->get("question");
        $data->answer = $request->get("answer");
        $data->category_id = $request->get("category_id");

        if($request->get("sort")){
            $data->sort = $request->get("sort");
        }

        $data->is_published = $request->get("is_published") ? $request->get("is_published") : 0;
        $data->save();

        $response = array(
            "message"=> "Data has been updated !",
            "data"=> $data
        );
        return response()->json($response);

    }

    public function delete($id){

        $data = Faq::where("id", $id)->first();

        if(is_null($data)){
            return abort(404);
        }

        Faq::where("id", $id)->delete();
        $response = array(
            "message"=> "Data has been deleted !",
            "data"=> $data
        );

        return response()->json($response);
    }



}
