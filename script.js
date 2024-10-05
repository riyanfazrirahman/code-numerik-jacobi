// Function to create the form for entering row and column numbers
function createBarisKolomForm() {
  let barisKolom = document.getElementById("barisKolom");
  let row = 3;
  let col = 4;

  let html = `
    <table class="w-100">
      <tr>
        <td class="w-50"><label for="row">Baris </label></td>
        <td><input class="w-100" type="number" id="row" value="${row}" /></td>
      </tr>
      <tr>
        <td><label for="col">Kolom </label></td>
        <td><input class="w-100" type="number" id="col" value="${col}" /></td>
      </tr>
    </table>
    <button id="set" class="m-0 btn" style="background-color:#3ebdc6; color:#fff4ea" >Set</button>
  `;

  barisKolom.innerHTML = html;

  document.getElementById("set").addEventListener("click", createInputGrid);
}

// Function to create the form for entering max iterations and tolerance
function createIterationsAndToleranceForm() {
  let iterationsAndTolerance = document.getElementById(
    "iterationsAndTolerance"
  );

  let html = `
    <table class="w-100">
      <tr>
        <td class="w-50"><label for="maxIterations">Max Iterations </label></td>
        <td><input class="w-100" type="number" id="maxIterations" value="1000" /></td>
      </tr>
      <tr>
        <td><label for="tolerance">Tolerance </label></td>
        <td><input class="w-100" type="number" id="tolerance" value="0.0001" step="0.0001" /></td>
      </tr>
    </table>
  `;

  iterationsAndTolerance.innerHTML = html;
}
/********************************************************************************/

// Function to create the input grid for matrix entries
function createInputGrid() {
  let row = parseInt(document.getElementById("row").value);
  let col = parseInt(document.getElementById("col").value);

  let gridHtml = "";
  gridHtml += `<h3 class="text-center mt-3">Matriks</h3>`;
  gridHtml += `<div class="text-center">`;
  for (let i = 1; i <= row; i++) {
    gridHtml += '<div class="mb-3">';
    for (let j = 1; j <= col; j++) {
      gridHtml += `<input style="width:70px" placeholder="a${i}(${j})" id="a${i}_${j}">`;
    }
    gridHtml += "</div>";
  }
  gridHtml += `</div>`;
  gridHtml += `
  <div class="d-flex justify-content-between">
    <button id="showJacobi" class="btn  w-100" style="background-color:#3ebdc6; color:#fff4ea" >Show Jacobi</button>
    <button id="showGaussSeidel" class="btn  w-100" style="background-color:#3ebdc6; color:#fff4ea" >Show Gauss Seidel</button>
  </div>
  <div class="d-flex justify-content-between">
    <button id="showJacobiCalculations" class="btn  w-100" style="background-color:#3ebdc6; color:#fff4ea" >Calculations Jacobi</button>
    <button id="showGaussSeidelCalculations" class="btn  w-100" style="background-color:#3ebdc6; color:#fff4ea" >Calculations Gauss Seidel</button>
  </div>
  <div class="d-flex justify-content-between">
    <a href="" class="btn btn-danger w-100">Reset</a>
  </div>
  `;
  document.getElementById("soal").innerHTML = gridHtml;

  document.getElementById("showJacobi").addEventListener("click", solveJacobi);
  document
    .getElementById("showJacobiCalculations")
    .addEventListener("click", JacobiCalculations);
  document
    .getElementById("showGaussSeidel")
    .addEventListener("click", solveGaussSeidel);
  document
    .getElementById("showGaussSeidelCalculations")
    .addEventListener("click", GaussSeidelCalculations);
}
/********************************************************************************/

// Function to solve Jacobi method
function solveJacobi() {
  let { A, b, rows } = collectMatrixData();
  let x = new Array(rows).fill(0); // Initial guess
  let iterations = [];

  let maxIterations = parseInt(document.getElementById("maxIterations").value);
  let tolerance = parseFloat(document.getElementById("tolerance").value);
  let xNew = [...x];

  for (let k = 0; k < maxIterations; k++) {
    let iteration = { x: [], errors: [] };
    for (let i = 0; i < rows; i++) {
      let sum = 0;
      for (let j = 0; j < rows; j++) {
        if (i !== j) {
          sum += A[i][j] * x[j];
        }
      }
      xNew[i] = (b[i] - sum) / A[i][i];
      iteration.x.push(xNew[i]);
      if (x[i] !== 0) {
        iteration.errors.push(Math.abs((xNew[i] - x[i]) / x[i]) * 100);
      } else {
        iteration.errors.push(100);
      }
    }
    iterations.push(iteration);
    if (converged(x, xNew, tolerance)) break;
    x = [...xNew];
  }

  displayIterationTable(iterations, "Jacobi Method Iterations:");
}

/********************************************************************************/

// Function to display Jacobi calculations for the first 3 iterations
function JacobiCalculations() {
  let { A, b, rows } = collectMatrixData();
  let x = new Array(rows).fill(0); // Initial guess
  let iterations = [];

  // Perform Jacobi iterations and display calculations for first 3 iterations
  let stepsHtml =
    '<h3 class="text-center mt-3">Jacobi Method Calculations:</h3>';
  stepsHtml += '<div id="jacobiCalculations">';

  for (let iter = 1; iter <= 3; iter++) {
    let xNew = new Array(rows).fill(0); // Initialize new values array for this iteration

    // Calculate new values for x using Jacobi method
    for (let i = 0; i < rows; i++) {
      let sum = 0;
      for (let j = 0; j < rows; j++) {
        if (i !== j) {
          sum += A[i][j] * x[j];
        }
      }
      xNew[i] = (b[i] - sum) / A[i][i];
    }

    // Update values of x for the next iteration
    x = [...xNew];

    // Append iteration calculations to stepsHtml
    stepsHtml += `<h5>Iteration ${iter}:</h5>`;
    for (let i = 0; i < rows; i++) {
      stepsHtml += `<pre class="bg-warning-subtle"><p>x${i + 1}${iter} = (${
        b[i]
      } - `;
      for (let j = 0; j < rows; j++) {
        if (j !== 0) {
          stepsHtml += ` - ${A[i][j]} * ${x[j].toFixed(5)}`;
        } else {
          stepsHtml += `${A[i][j]} * ${x[j].toFixed(5)}`;
        }
      }
      stepsHtml += `) / ${A[i][i]} = ${xNew[i].toFixed(5)}</p></pre>`;
    }
  }

  stepsHtml += "</div>";

  // Display the stepsHtml in the Jacobi calculations section
  document.getElementById("soal").innerHTML += stepsHtml;
}

/********************************************************************************/

// Function to solve Gauss-Seidel method
function solveGaussSeidel() {
  let { A, b, rows } = collectMatrixData();
  let x = new Array(rows).fill(0); // Initial guess
  let iterations = [];

  let maxIterations = parseInt(document.getElementById("maxIterations").value);
  let tolerance = parseFloat(document.getElementById("tolerance").value);

  for (let k = 0; k < maxIterations; k++) {
    let iteration = { x: [...x], errors: [] };
    let xNew = [...x]; // Create a temporary array to store the updated values
    for (let i = 0; i < rows; i++) {
      let sum = 0;
      for (let j = 0; j < rows; j++) {
        if (i !== j) {
          sum += A[i][j] * xNew[j]; // Use xNew instead of x
        }
      }
      let xOld = x[i];
      xNew[i] = (b[i] - sum) / A[i][i];
      if (xOld !== 0) {
        iteration.errors.push(Math.abs((xNew[i] - xOld) / xOld) * 100);
      } else {
        iteration.errors.push(100);
      }
    }
    iterations.push({ x: [...xNew], errors: [...iteration.errors] });
    if (converged(x, xNew, tolerance)) break;
    x = [...xNew]; // Update the x array at the end of each iteration
  }

  displayIterationTable(iterations, "Gauss-Seidel Method Iterations:");
}
/********************************************************************************/

// Function to display Gauss-Seidel calculations for the first 3 iterations
function GaussSeidelCalculations() {
  let row = parseInt(document.getElementById("row").value);
  let col = parseInt(document.getElementById("col").value);

  let A = [];
  let b = [];

  // Collect matrix A and vector b from user input
  for (let i = 1; i <= row; i++) {
    let rowArr = [];
    for (let j = 1; j <= col; j++) {
      let value = parseFloat(document.getElementById(`a${i}_${j}`).value);
      if (j === col) {
        b.push(value);
      } else {
        rowArr.push(value);
      }
    }
    A.push(rowArr);
  }

  // Initialize variables
  let x = 0,
    y = 0,
    z = 0;

  // Perform Gauss-Seidel iterations and display calculations for first 3 iterations
  let stepsHtml =
    '<h3 class="text-center mt-3">Gauss-Seidel Method Calculations:</h3>';
  stepsHtml += '<div id="gaussSeidelCalculations">';
  for (let iter = 1; iter <= 3; iter++) {
    let xNew = [],
      yNew = [],
      zNew = [];

    // Calculate new values for x, y, z
    if (iter === 1) {
      x = (b[0] - A[0][1] * y - A[0][2] * z) / A[0][0];
      y = (b[1] - A[1][0] * x - A[1][2] * z) / A[1][1];
      z = (b[2] - A[2][0] * x - A[2][1] * y) / A[2][2];
    } else if (iter === 2) {
      x = (b[0] - A[0][1] * y - A[0][2] * z) / A[0][0];
      y = (b[1] - A[1][0] * x - A[1][2] * z) / A[1][1];
      z = (b[2] - A[2][0] * x - A[2][1] * y) / A[2][2];
    } else if (iter === 3) {
      x = (b[0] - A[0][1] * y - A[0][2] * z) / A[0][0];
      y = (b[1] - A[1][0] * x - A[1][2] * z) / A[1][1];
      z = (b[2] - A[2][0] * x - A[2][1] * y) / A[2][2];
    }

    // Append iteration calculations to stepsHtml
    stepsHtml += `<h5>Iterasi ${iter}:</h5><pre class="bg-warning-subtle">`;
    stepsHtml += `<p>x${iter} = (${b[0]} - ${A[0][1]} * ${y} - ${
      A[0][2]
    } * ${z}) / ${A[0][0]} = ${x.toFixed(5)}</p>`;
    stepsHtml += `<p>y${iter} = (${b[1]} - ${A[1][0]} * ${x} - ${
      A[1][2]
    } * ${z}) / ${A[1][1]} = ${y.toFixed(5)}</p>`;
    stepsHtml += `<p>z${iter} = (${b[2]} - ${A[2][0]} * ${x} - ${
      A[2][1]
    } * ${y}) / ${A[2][2]} = ${z.toFixed(5)}</p></pre>`;
  }
  stepsHtml += "</div>";

  // Display the stepsHtml in the Gauss-Seidel calculations section
  document.getElementById("soal").innerHTML += stepsHtml;
}
/********************************************************************************/

// Function to collect matrix A and vector b from user input
function collectMatrixData() {
  let row = parseInt(document.getElementById("row").value);
  let col = parseInt(document.getElementById("col").value);

  let A = [];
  let b = [];

  for (let i = 1; i <= row; i++) {
    let rowArr = [];
    for (let j = 1; j <= col; j++) {
      rowArr.push(parseFloat(document.getElementById(`a${i}_${j}`).value));
    }
    A.push(rowArr);
    b.push(parseFloat(document.getElementById(`a${i}_${col}`).value));
  }
  return { A, b, rows: row };
}
/********************************************************************************/

// Function to check convergence based on tolerance
function converged(xOld, xNew, tolerance) {
  for (let i = 0; i < xOld.length; i++) {
    if (Math.abs(xNew[i] - xOld[i]) > tolerance) {
      return false;
    }
  }
  return true;
}
/********************************************************************************/

// Function to display iteration table with results
function displayIterationTable(iterations, title) {
  let tableHtml = `<h3 class="text-center mt-3">${title}</h3>`;
  tableHtml += '<div class="table-responsive">';
  tableHtml += '<table class="table table-bordered border-primary">';
  tableHtml += "<tr><th>Iterasi</th>";
  for (let i = 0; i < iterations[0].x.length; i++) {
    tableHtml += `<th>X${i + 1}</th>`;
  }
  for (let i = 0; i < iterations[0].x.length; i++) {
    tableHtml += `<th>εX${i + 1} (%)</th>`;
  }
  tableHtml += "</tr>";

  iterations.forEach((iteration, index) => {
    tableHtml += `<tr><td>${index + 1}</td>`;
    iteration.x.forEach((value) => {
      tableHtml += `<td>${value.toFixed(5)}</td>`;
    });
    iteration.errors.forEach((error) => {
      tableHtml += `<td>${error.toFixed(2)}</td>`;
    });
    tableHtml += "</tr>";
  });

  tableHtml += "</table></div>";
  document.getElementById("soal").innerHTML += tableHtml;
}
/********************************************************************************/

// Initialize the form creation functions
createBarisKolomForm();
createIterationsAndToleranceForm();
