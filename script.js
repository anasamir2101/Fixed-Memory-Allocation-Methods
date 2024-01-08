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
  let allocateSelect = document.getElementById('processPartition');
  let deallocateSelect = document.getElementById('deallocateProcessPartition');

  allocateSelect.innerHTML = '';
  deallocateSelect.innerHTML = '';

  partitions.forEach((partition, index) => {
    let allocateOption = document.createElement('option');
    allocateOption.value = index;
    allocateOption.textContent = 'Partition ' + (index + 1);
    allocateSelect.appendChild(allocateOption);

    let deallocateOption = document.createElement('option');
    deallocateOption.value = index;
    deallocateOption.textContent = 'Partition ' + (index + 1);
    deallocateSelect.appendChild(deallocateOption);
  });

  document.getElementById('deallocateProcessInput').style.display = 'flex';
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
    alert('Please enter a valid process size.');
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

  populateProcessPartitionSelect();
}
function calculateInternalFragmentation() {
  let totalInternalFragmentation = 0;

  for (let i = 0; i < totalPartitions; i++) {
    let partition = partitions[i];
    if (partition.process) {
      let internalFragmentation = partition.size - partition.process;
      totalInternalFragmentation += internalFragmentation;
    }
  }

  alert('Total Internal Fragmentation: ' + totalInternalFragmentation);
}

function deallocateProcess() {
  let selectedPartitionIndex = parseInt(
    document.getElementById('deallocateProcessPartition').value
  );

  if (
    isNaN(selectedPartitionIndex) ||
    selectedPartitionIndex < 0 ||
    selectedPartitionIndex >= partitions.length
  ) {
    alert('Please select a valid partition for deallocation.');
    return;
  }

  let selectedPartition = partitions[selectedPartitionIndex];
  if (!selectedPartition.process) {
    alert('No process to deallocate in this partition.');
    return;
  }

  selectedPartition.process = null;

  let partitionDiv = document.getElementById(
    'partition' + selectedPartitionIndex
  );
  let processDiv = partitionDiv.querySelector('.process');
  partitionDiv.removeChild(processDiv);

  populateProcessPartitionSelect();
}
function downloadTutorial() {
  const filename = 'tutorial.txt';
  const link = document.createElement('a');
  link.download = filename;
  const blob = new Blob(
    [
      `First step is to select whether we want to perform Fixed Partitioning for Equal Size or Unequal Size. 
After that, we will enter the number of partitions, which can range from 1 to 5.
 After entering the number of partitions, we will input the memory size. The memory size should be 55 or more
 because we have allocated 50 units of memory for the OS.If we enter the wrong number of partitions or size, 
an alert function  will be called. 
After entering the partitions and memory size, we will click the 'Create Partitions' button to create the partitions

Equal Size: If we have selected 'Equal Size,' partitions will be created automatically. All partitions are of equal size.

Unequal Size: If we select 'Unequal Size,' we will manually enter the size for each partition, and the partitions will be created
accordingly. If the sum of partition sizes exceeds the memory size, an alert will be displayed, and the page will be refreshed.
Partitions can be of different sizes.

Afterward, we will allocate a process. We can only allocate one process to a single partition. If we assign a process size larger than
the partition size, it will display an error Subsequently, we can also deallocate a process if a partition has a process allocated to it

Developed By
Shehryar Sohail (21-CS-39)
M Anas Amir (21-CS-66)
Kamran Arif (21-CS-129)`,
    ],
    {
      type: 'application/txt',
    }
  );
  link.href = window.URL.createObjectURL(blob);

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}
