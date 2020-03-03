<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
    <script src="./javascript/tags.js"></script>
    <script src="./javascript/stories.js"></script>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" 
               integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="./css/myTest.css">
</head>

<body>
    
    <h2 class="mt-3 pl-2 pb-3">This is an exercise.</h2>
    
    <div class="tab">
      <button class="tablinks" onclick="openTag(event, 'dataset1')">Data Set 1 - status data</button>
      <button class="tablinks" onclick="openTag(event, 'dataset2')">Data Set 2 - online stories</button>
    </div>
    
    <div id="dataset1" class="tabcontent container">
      <?php 
          $statuses = json_decode(file_get_contents('./storage/dataset1.json'));
     ?>
      <h4 class="display-4 text-center mb-5">Status data at a glance</h4>
      <div class="row">
      <?php foreach($statuses as $s) {
          $color = "green";
          $status = $s->status;
          if($status === "fail") {
              $color = "red"; 
          } elseif ($status === "warn") {
            $color = "yellow";
          }
      ?>
          <div class="col-2">
            <div class="card mb-2 pl-2" style="background-color: <?php echo $color; ?>">
              <h5 class="h5 mb-0">
                Process # <?php echo $s->pid; ?>
              </h5>
              <div mt-0>
                <em><strong>Status: <?php echo $s->status; ?></strong></em>
              </div>
            </div>
          </div>
      <?php } ?>	 
      </div>
    </div>
    
    <div id="dataset2" class="tabcontent" ng-app="app">
      <stories></stories>    
    </div>    

</body>
</html>