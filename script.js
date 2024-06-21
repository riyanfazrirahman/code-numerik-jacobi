function createBarisKolomForm() {
  let barisKolom = document.getElementById("barisKolom");
  let row = 3;
  let col = 4;

  let html = `
      <label for="row">Baris </label>
      <input type="number" id="row" value="${row}" /> 
      <label for="col">Kolom </label>
      <input type="number" id="col" value="${col}" />
      <button id="set">Set</button>
    `;

  barisKolom.innerHTML = html;

  document.getElementById("set").addEventListener("click", createInputGrid);
}

function createIterationsAndToleranceForm() {
  let iterationsAndTolerance = document.getElementById(
    "iterationsAndTolerance"
  );

  let html = `
      <label for="maxIterations">Max Iterations </label>
      <input type="number" id="maxIterations" value="1000" />
      <label for="tolerance">Tolerance </label>
      <input type="number" id="tolerance" value="0.0001" step="0.0001" />
    `;

  iterationsAndTolerance.innerHTML = html;
}

function createInputGrid() {
  let row = parseInt(document.getElementById("row").value);
  let col = parseInt(document.getElementById("col").value);

  let gridHtml = "";

  for (let i = 1; i <= row; i++) {
    gridHtml += '<div style="margin-top: 10px;">';
    for (let j = 1; j <= col; j++) {
      gridHtml += `<input style="width:70px" placeholder="a${i}(${j})" id="a${i}_${j}">`;
    }
    gridHtml += "</div>";
  }
  gridHtml +=
    '<button id="showMatriks" style="margin-top: 10px;">Show Matriks</button>';
  gridHtml +=
    '<button id="showJacobi" style="margin-top: 10px;">Show Jacobi</button>';
  gridHtml +=
    '<button id="showGaussSeidel" style="margin-top: 10px;">Show Gauss Seidel</button>';
  document.getElementById("soal").innerHTML = gridHtml;

  document
    .getElementById("showMatriks")
    .addEventListener("click", displayMatrix);
  document.getElementById("showJacobi").addEventListener("click", solveJacobi);
  document
    .getElementById("showGaussSeidel")
    .addEventListener("click", solveGaussSeidel);
}

function displayMatrix() {
  let row = parseInt(document.getElementById("row").value);
  let col = parseInt(document.getElementById("col").value);

  let tableHtml = '<table border="1" style="border-collapse: collapse;">';
  for (let i = 1; i <= row; i++) {
    tableHtml += "<tr>";
    for (let j = 1; j <= col; j++) {
      let value = document.getElementById(`a${i}_${j}`).value;
      tableHtml += `<td>${value}</td>`;
    }
    tableHtml += "</tr>";
  }
  tableHtml += "</table>";
  document.getElementById("soal").innerHTML += tableHtml;
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
  let tableHtml = `<h3>${title}</h3><table border="1" style="border-collapse: collapse;"><tr><th>Iterasi</th>`;
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

  tableHtml += `</table>`;
  document.getElementById("soal").innerHTML += tableHtml;
}

createBarisKolomForm();
createIterationsAndToleranceForm();
