function showModal() {
  document.getElementById('myModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('myModal').style.display = 'none';
}

let partitions = [];
let totalPartitions = 0;
let totalMemorySize = 0;
const osMemorySize = 50;
let processCounter = 0;

function partitionTypeChanged() {
  let type = document.querySelector(
    'input[name="partitionType"]:checked'
  ).value;
  document.getElementById('partitionOptions').innerHTML = '';
  document.getElementById('partitions').innerHTML = '';
  document.getElementById('processInput').style.display = 'none';
  partitions = [];

  if (type === 'equal' || type === 'unequal') {
    let html =
      '<label>Enter Number of Partitions:</label>' +
      '<input type="number" id="numPartitions" min="1" max="5" />' +
      '<label>Enter Total Memory Size:</label>' +
      '<input type="number" id="totalMemorySize" />' +
      '<button id="createPartitionsButton" onclick="createPartitions(\'' +
      type +
      '\')">Create Partitions</button>';
    document.getElementById('partitionOptions').innerHTML = html;
  }
}

function createPartitions(type) {
  let numPartitions = parseInt(document.getElementById('numPartitions').value);
  totalMemorySize =
    parseInt(document.getElementById('totalMemorySize').value) - osMemorySize;
  if (
    numPartitions <= 0 ||
    totalMemorySize < 5 ||
    numPartitions > 5 ||
    isNaN(numPartitions) ||
    isNaN(totalMemorySize)
  ) {
    alert('Please enter correct memory partitions or memory size');
    return;
  }

  totalPartitions = numPartitions;
  let partitionsDiv = document.getElementById('partitions');
  partitionsDiv.innerHTML = '';
  partitions = [];

  let totalAllocated = 0;
  for (let i = 0; i < numPartitions; i++) {
    let size;
    if (type === 'equal') {
      size = Math.floor(totalMemorySize / numPartitions);
    } else {
      size = parseInt(prompt('Enter size for partition ' + (i + 1)));
      if (isNaN(size) || size <= 0 || totalAllocated + size > totalMemorySize) {
        alert(
          'Invalid partition size. Exceeds available memory. Page will reload.'
        );
        location.reload();
        return;
      }
    }
    totalAllocated += size;
    partitions.push({ size: size, process: null });

    let partitionDiv = document.createElement('div');
    partitionDiv.className = 'partition';
    partitionDiv.id = 'partition' + i;
    partitionDiv.innerHTML =
      '<div class="name">Partition ' + (i + 1) + ' (' + size + ')</div>';
    partitionsDiv.appendChild(partitionDiv);
  }

  // OS Partition
  let osPartitionDiv = document.createElement('div');
  osPartitionDiv.className = 'partition os-partition';
  osPartitionDiv.innerHTML =
    '<div class="name">OS Partition (' + osMemorySize + ')</div>';
  document
    .getElementById('partitions')
    .insertBefore(
      osPartitionDiv,
      document.getElementById('partitions').firstChild
    );

  populateProcessPartitionSelect();
  document.getElementById('processInput').style.display = 'flex';
}

function populateProcessPartitionSelect() {
  let select = document.getElementById('processPartition');
  select.innerHTML = '';
  partitions.forEach((partition, index) => {
    let option = document.createElement('option');
    option.value = index;
    option.textContent = 'Partition ' + (index + 1);
    select.appendChild(option);
  });
}

function allocateProcess() {
  let processSize = parseInt(document.getElementById('processSize').value);
  let selectedPartitionIndex = parseInt(
    document.getElementById('processPartition').value
  );

  if (
    isNaN(processSize) ||
    selectedPartitionIndex < 0 ||
    selectedPartitionIndex >= partitions.length
  ) {
    alert('please enter process size.');
    return;
  }

  let selectedPartition = partitions[selectedPartitionIndex];
  if (selectedPartition.process) {
    alert('This partition already has a process allocated.');
    return;
  }

  if (processSize > selectedPartition.size) {
    alert('Process size is too large for the selected partition.');
    return;
  }

  selectedPartition.process = processSize;
  let processDiv = document.createElement('div');
  processDiv.className = 'process';
  processDiv.style.height = (processSize / selectedPartition.size) * 100 + '%';

  processDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

  processCounter++;
  processDiv.innerHTML = 'Process ' + processCounter + ' (' + processSize + ')';
  document
    .getElementById('partition' + selectedPartitionIndex)
    .appendChild(processDiv);
}
