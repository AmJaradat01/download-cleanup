# Download Cleanup

**Download Cleanup** is a cross-platform Node.js tool for organizing and cleaning up your downloaded files based on their metadata (e.g., "Where from"). The tool provides configurable rules to move or remove files downloaded from specific websites, with support for time-based conditions.

## Features
- **Move Files**: Automatically move files downloaded from specific websites to designated folders.
- **Remove Files**: Clean up files with configurable conditions, such as immediately or after a specific time (e.g., hours, days, months).
- **Cross-Platform**: Compatible with Windows, macOS, and Linux.
- **Highly Configurable**: Define custom rules for each website.

## Installation
1. Ensure you have Node.js installed. You can download it from [Node.js Official Website](https://nodejs.org/).
2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/download-cleanup.git
   cd download-cleanup
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The configuration is defined in the `config` array within the script:

```javascript
const config = [
    {
        website: 'example.com',
        action: 'move',
        targetFolder: '/path/to/target/folder',
        condition: {
            type: 'after',
            value: { days: 1 }, // Move files after 1 day
        },
    },
    {
        website: 'anotherwebsite.com',
        action: 'remove',
        condition: {
            type: 'after',
            value: { hours: 12 }, // Remove files after 12 hours
        },
    },
    {
        website: 'immediatecleanup.com',
        action: 'remove',
        condition: { type: 'immediately' }, // Remove files immediately
    },
];
```

### Configuration Options
- **website**: The domain name of the website (e.g., `example.com`).
- **action**: The action to perform (`move` or `remove`).
- **targetFolder**: The folder where files should be moved (required for `move` action).
- **condition**:
    - **type**: Condition type (`immediately` or `after`).
    - **value**: Specify time in `hours`, `days`, `minutes`, or `months` (only applicable for `after` type).

## Usage

### Run the Script
To execute the tool manually, run:
```bash
node download-cleanup.js
```

### Automate Execution
You can schedule the script to run periodically using:
- **Windows**: Task Scheduler
- **Linux/macOS**: Cron or Launchd

#### Example Cron Job (Linux/macOS)
Run the script every hour:
```bash
0 * * * * /usr/bin/node /path/to/download-cleanup.js
```

## Development
Feel free to contribute by submitting pull requests or issues. Clone the repository, make changes, and test locally:
```bash
git clone https://github.com/AmJaradat01/download-cleanup.git
cd download-cleanup
npm install
```

## License
This project is licensed under the [MIT License](LICENSE).

## Author
Ali M. Jaradat <amjaradat01@gmail.com>
