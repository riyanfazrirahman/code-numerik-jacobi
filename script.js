function createBarisKolomForm() {
  let barisKolom = document.getElementById("barisKolom");
  let row = 3;
  let col = 4;

  let html = `
  <table  class="w-100">
  <tr>
  <td class="w-50"><label for="row">Baris </label></td>
  <td><input  class="w-100" type="number" id="row" value="${row}" /> </td>
  </tr>
  <tr>
  <td><label for="col">Kolom </label></td>
  <td><input  class="w-100" type="number" id="col" value="${col}" /></td>
  </tr>
  <tr>
  <td></td>
  <td> <button id="set" class="w-100 btn btn-primary">Set</button></td>
  </tr>
  </table>
    `;

  barisKolom.innerHTML = html;

  document.getElementById("set").addEventListener("click", createInputGrid);
}

function createIterationsAndToleranceForm() {
  let iterationsAndTolerance = document.getElementById(
    "iterationsAndTolerance"
  );

  let html = `
  <table class="w-100">
  <tr>
  <td class="w-50 ><label for="maxIterations">Max Iterations </label></td>
  <td><input  class="w-100" type="number" id="maxIterations" value="1000" /></td>
  </tr>
  <tr>
  <td> <label for="tolerance">Tolerance </label></td>
  <td> <input  class="w-100" type="number" id="tolerance" value="0.0001" step="0.0001" /></td>
  </tr>
  </table>
    `;

  iterationsAndTolerance.innerHTML = html;
}

function createInputGrid() {
  let row = parseInt(document.getElementById("row").value);
  let col = parseInt(document.getElementById("col").value);

  let gridHtml = "";

  gridHtml += "Matriks";
  for (let i = 1; i <= row; i++) {
    gridHtml += '<div class="mb-3">';
    for (let j = 1; j <= col; j++) {
      gridHtml += `<input style="width:70px" placeholder="a${i}(${j})" id="a${i}_${j}">`;
    }
    gridHtml += "</div>";
  }
  gridHtml += '<div class="d-flex justify-content-between">';
  gridHtml +=
    '<button id="showJacobi"  class="btn btn-primary me-1 w-100">Show Jacobi</button>';
  gridHtml +=
    '<button id="showGaussSeidel"  class="btn btn-primary ms-1 w-100">Show Gauss Seidel</button>';
  gridHtml += "</div>";
  gridHtml += '<a href="" class="btn btn-danger w-100 mt-3">Reset</a>';

  document.getElementById("soal").innerHTML = gridHtml;

  document.getElementById("showJacobi").addEventListener("click", solveJacobi);
  document
    .getElementById("showGaussSeidel")
    .addEventListener("click", solveGaussSeidel);
}

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

function collectMatrixData() {
  let row = parseInt(document.getElementById("row").value);
  let col = parseInt(document.getElementById("col").value);

  let A = [];
  let b = [];

  for (let i = 1; i <= row; i++) {
    let rowArr = [];
    for (let j = 1; j < col; j++) {
      // cols-1 for excluding the last column which is b
      rowArr.push(parseFloat(document.getElementById(`a${i}_${j}`).value));
    }
    A.push(rowArr);
    b.push(parseFloat(document.getElementById(`a${i}_${col}`).value));
  }
  return { A, b, rows: row };
}

function converged(xOld, xNew, tolerance) {
  for (let i = 0; i < xOld.length; i++) {
    if (Math.abs(xNew[i] - xOld[i]) > tolerance) {
      return false;
    }
  }
  return true;
}

function displayIterationTable(iterations, title) {
  let tableHtml = `<h3 class="text-center mt-3">${title}</h3><div class="table-responsive"><table class="table table-bordered border-primary"><tr><th>Iterasi</th>`;
  for (let i = 0; i < iterations[0].x.length; i++) {
    tableHtml += `<th>X${i + 1}</th>`;
  }
  for (let i = 0; i < iterations[0].x.length; i++) {
    tableHtml += `<th>εX${i + 1} (%)</th>`;
  }
  tableHtml += `</tr>`;

  iterations.forEach((iteration, index) => {
    tableHtml += `<tr><td>${index + 1}</td>`;
    iteration.x.forEach((value) => {
      tableHtml += `<td>${value.toFixed(5)}</td>`;
    });
    iteration.errors.forEach((error) => {
      tableHtml += `<td>${error.toFixed(2)}</td>`;
    });
    tableHtml += `</tr>`;
  });

  tableHtml += `</table></div>`;
  document.getElementById("soal").innerHTML += tableHtml;
}

createBarisKolomForm();
createIterationsAndToleranceForm();
