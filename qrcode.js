"use strict";

var QRCode;

(function () {
	//---------------------------------------------------------------------
	//
	// "QR Code" is a registered trademark of DENSO WAVE INCORPORATED.
	// https://www.denso-wave.com/qrcode/faqpatent-e.html
	//
	//---------------------------------------------------------------------
	let Drawing;
	const textEncoder = new TextEncoder();
	const UTF8_BOM = [0xEF, 0xBB, 0xBF];

	function _encodeUtf8Bytes(text) {
		const utf8Bytes = Array.from(textEncoder.encode(text));
		return utf8Bytes.length === text.length ? utf8Bytes : UTF8_BOM.concat(utf8Bytes);
	}

	function QR8bitByte(data) {
		this.mode = QRMode.MODE_8BIT_BYTE;
		this.data = data;
		this.parsedData = _encodeUtf8Bytes(this.data);
	}

	QR8bitByte.prototype = {
		getLength: function (buffer) {
			return this.parsedData.length;
		},
		write: function (buffer) {
			for (const value of this.parsedData) {
				buffer.put(value, 8);
			}
		}
	};

	function QRCodeModel(typeNumber, errorCorrectLevel) {
		this.typeNumber = typeNumber;
		this.errorCorrectLevel = errorCorrectLevel;
		this.modules = null;
		this.moduleCount = 0;
		this.dataCache = null;
		this.dataList = [];
	}

	QRCodeModel.prototype = {
		addData(data) {
			const newData = new QR8bitByte(data);
			this.dataList.push(newData);
			this.dataCache = null;
		},

		isDark(row, col) {
			if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) throw new Error(`${row},${col}`);

			return this.modules[row][col];
		},

		getModuleCount() {
			return this.moduleCount;
		},

		make() {
			this.makeImpl(false, this.getBestMaskPattern());
		},

		makeImpl(test, maskPattern) {
			this.moduleCount = this.typeNumber * 4 + 17;
			this.modules = new Array(this.moduleCount);

			for (let row = 0; row < this.moduleCount; row++) {
				this.modules[row] = new Array(this.moduleCount);
				for (let col = 0; col < this.moduleCount; col++)
					this.modules[row][col] = null;
			}

			this.setupPositionProbePattern(0, 0);
			this.setupPositionProbePattern(this.moduleCount - 7, 0);
			this.setupPositionProbePattern(0, this.moduleCount - 7);
			this.setupPositionAdjustPattern();
			this.setupTimingPattern();
			this.setupTypeInfo(test, maskPattern);

			if (this.typeNumber >= 7) this.setupTypeNumber(test);

			if (this.dataCache == null) this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);

			this.mapData(this.dataCache, maskPattern);
		},

		setupPositionProbePattern(row, col) {
			for (let r = -1; r <= 7; r++) {
				if (row + r <= -1 || this.moduleCount <= row + r) continue;

				for (let c = -1; c <= 7; c++) {
					if (col + c <= -1 || this.moduleCount <= col + c) continue;

					if ((0 <= r && r <= 6 && (c === 0 || c === 6))
						|| (0 <= c && c <= 6 && (r === 0 || r === 6))
						|| (2 <= r && r <= 4 && 2 <= c && c <= 4)) 
						this.modules[row + r][col + c] = true;
					else this.modules[row + r][col + c] = false;
				}
			}
		},

		getBestMaskPattern() {
			let minLostPoint = 0;
			let pattern = 0;

			for (let index = 0; index < 8; index++) {
				this.makeImpl(true, index);
				const lostPoint = QRUtil.getLostPoint(this);

				if (index === 0 || minLostPoint > lostPoint) {
					minLostPoint = lostPoint;
					pattern = index;
				}
			}

			return pattern;
		},

		setupTimingPattern() {
			for (let row = 8; row < this.moduleCount - 8; row++) {
				if (this.modules[row][6] != null) continue;

				this.modules[row][6] = row % 2 === 0;
			}

			for (let col = 8; col < this.moduleCount - 8; col++) {
				if (this.modules[6][col] != null) continue;

				this.modules[6][col] = col % 2 === 0;
			}
		},

		setupPositionAdjustPattern() {
			const positions = QRUtil.getPatternPosition(this.typeNumber);

			for (let rowIndex = 0; rowIndex < positions.length; rowIndex++)
				for (let colIndex = 0; colIndex < positions.length; colIndex++) {
					const row = positions[rowIndex];
					const col = positions[colIndex];

					if (this.modules[row][col] != null) continue;

					for (let r = -2; r <= 2; r++)
						for (let c = -2; c <= 2; c++) {
							if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) this.modules[row + r][col + c] = true;
							else this.modules[row + r][col + c] = false;
						}
				}
		},

		setupTypeNumber(test) {
			const bits = QRUtil.getBCHTypeNumber(this.typeNumber);

			for (let index = 0; index < 18; index++) {
				const mod = !test && ((bits >> index) & 1) === 1;
				this.modules[Math.floor(index / 3)][index % 3 + this.moduleCount - 11] = mod;
			}

			for (let index = 0; index < 18; index++) {
				const mod = !test && ((bits >> index) & 1) === 1;
				this.modules[index % 3 + this.moduleCount - 11][Math.floor(index / 3)] = mod;
			}
		},

		setupTypeInfo(test, maskPattern) {
			const data = (this.errorCorrectLevel << 3) | maskPattern;
			const bits = QRUtil.getBCHTypeInfo(data);

			for (let index = 0; index < 15; index++) {
				const mod = !test && ((bits >> index) & 1) === 1;

				if (index < 6) this.modules[index][8] = mod;
				else if (index < 8) this.modules[index + 1][8] = mod;
				else this.modules[this.moduleCount - 15 + index][8] = mod;
			}

			for (let index = 0; index < 15; index++) {
				const mod = !test && ((bits >> index) & 1) === 1;

				if (index < 8) this.modules[8][this.moduleCount - index - 1] = mod;
				else if (index < 9) this.modules[8][15 - index] = mod;
				else this.modules[8][14 - index] = mod;
			}

			this.modules[this.moduleCount - 8][8] = !test;
		},

		mapData(data, maskPattern) {
			let increment = -1;
			let row = this.moduleCount - 1;
			let bitIndex = 7;
			let byteIndex = 0;

			for (let col = this.moduleCount - 1; col > 0; col -= 2) {
				if (col === 6) col--;

				while (true) {
					for (let offset = 0; offset < 2; offset++) {
						if (this.modules[row][col - offset] != null) continue;

						let dark = false;

						if (byteIndex < data.length) dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;

						const mask = QRUtil.getMask(maskPattern, row, col - offset);
						if (mask) dark = !dark;

						this.modules[row][col - offset] = dark;
						bitIndex--;

						if (bitIndex === -1) {
							byteIndex++;
							bitIndex = 7;
						}
					}

					row += increment;
					if (row < 0 || this.moduleCount <= row) {
						row -= increment;
						increment = -increment;
						break;
					}
				}
			}
		}
	};

	QRCodeModel.PAD0 = 0xEC;
	QRCodeModel.PAD1 = 0x11;

	QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
		const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
		const buffer = new QRBitBuffer();

		for (let index = 0; index < dataList.length; index++) {
			const data = dataList[index];
			buffer.put(data.mode, 4);
			buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
			data.write(buffer);
		}

		let totalDataCount = 0;
		for (let index = 0; index < rsBlocks.length; index++) {
			totalDataCount += rsBlocks[index].dataCount;
		}

		if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error(`code length overflow. (${buffer.getLengthInBits()}>${totalDataCount * 8})`);

		if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);

		while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(false);

		while (true) {
			if (buffer.getLengthInBits() >= totalDataCount * 8) break;

			buffer.put(QRCodeModel.PAD0, 8);

			if (buffer.getLengthInBits() >= totalDataCount * 8) break;

			buffer.put(QRCodeModel.PAD1, 8);
		}

		return QRCodeModel.createBytes(buffer, rsBlocks);
	};

	QRCodeModel.createBytes = function (buffer, rsBlocks) {
		let offset = 0;
		let maxDcCount = 0;
		let maxEcCount = 0;
		const dcdata = new Array(rsBlocks.length);
		const ecdata = new Array(rsBlocks.length);

		for (let blockIndex = 0; blockIndex < rsBlocks.length; blockIndex++) {
			const dcCount = rsBlocks[blockIndex].dataCount;
			const ecCount = rsBlocks[blockIndex].totalCount - dcCount;

			maxDcCount = Math.max(maxDcCount, dcCount);
			maxEcCount = Math.max(maxEcCount, ecCount);

			dcdata[blockIndex] = new Uint8Array(dcCount);
			for (let index = 0; index < dcdata[blockIndex].length; index++) {
				dcdata[blockIndex][index] = 0xff & buffer.buffer[index + offset];
			}

			offset += dcCount;

			const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
			const rawPoly = new QRPolynomial(dcdata[blockIndex], rsPoly.getLength() - 1);
			const modPoly = rawPoly.mod(rsPoly);

			ecdata[blockIndex] = new Uint8Array(rsPoly.getLength() - 1);
			for (let index = 0; index < ecdata[blockIndex].length; index++) {
				const modIndex = index + modPoly.getLength() - ecdata[blockIndex].length;
				ecdata[blockIndex][index] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
			}
		}

		let totalCodeCount = 0;
		for (let index = 0; index < rsBlocks.length; index++) {
			totalCodeCount += rsBlocks[index].totalCount;
		}

		const data = new Uint8Array(totalCodeCount);
		let index = 0;

		for (let dataIndex = 0; dataIndex < maxDcCount; dataIndex++) {
			for (let blockIndex = 0; blockIndex < rsBlocks.length; blockIndex++) {
				if (dataIndex < dcdata[blockIndex].length) data[index++] = dcdata[blockIndex][dataIndex];
			}
		}

		for (let dataIndex = 0; dataIndex < maxEcCount; dataIndex++) {
			for (let blockIndex = 0; blockIndex < rsBlocks.length; blockIndex++) {
				if (dataIndex < ecdata[blockIndex].length) data[index++] = ecdata[blockIndex][dataIndex];
			}
		}

		return data;
	};

	const QRMode = {
		MODE_NUMBER: 1 << 0,
		MODE_ALPHA_NUM: 1 << 1,
		MODE_8BIT_BYTE: 1 << 2,
		MODE_KANJI: 1 << 3
	};

	const QRErrorCorrectLevel = {
		L: 1,
		M: 0,
		Q: 3,
		H: 2
	};

	const QRMaskPattern = {
		PATTERN000: 0,
		PATTERN001: 1,
		PATTERN010: 2,
		PATTERN011: 3,
		PATTERN100: 4,
		PATTERN101: 5,
		PATTERN110: 6,
		PATTERN111: 7
	};

	const QRUtil = {
		PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
		G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
		G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
		G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),

		getBCHTypeInfo(data) {
			let digitData = data << 10;

			while (QRUtil.getBCHDigit(digitData) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) digitData ^= QRUtil.G15 << (QRUtil.getBCHDigit(digitData) - QRUtil.getBCHDigit(QRUtil.G15));

			return ((data << 10) | digitData) ^ QRUtil.G15_MASK;
		},

		getBCHTypeNumber(data) {
			let digitData = data << 12;

			while (QRUtil.getBCHDigit(digitData) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) digitData ^= QRUtil.G18 << (QRUtil.getBCHDigit(digitData) - QRUtil.getBCHDigit(QRUtil.G18));

			return (data << 12) | digitData;
		},

		getBCHDigit(data) {
			let digit = 0;

			while (data !== 0) {
				digit++;
				data >>>= 1;
			}

			return digit;
		},

		getPatternPosition(typeNumber) {
			return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
		},

		getMask(maskPattern, row, col) {
			switch (maskPattern) {
				case QRMaskPattern.PATTERN000: return (row + col) % 2 === 0;
				case QRMaskPattern.PATTERN001: return row % 2 === 0;
				case QRMaskPattern.PATTERN010: return col % 3 === 0;
				case QRMaskPattern.PATTERN011: return (row + col) % 3 === 0;
				case QRMaskPattern.PATTERN100: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
				case QRMaskPattern.PATTERN101: return (row * col) % 2 + (row * col) % 3 === 0;
				case QRMaskPattern.PATTERN110: return ((row * col) % 2 + (row * col) % 3) % 2 === 0;
				case QRMaskPattern.PATTERN111: return ((row * col) % 3 + (row + col) % 2) % 2 === 0;
				default: throw new Error(`bad maskPattern:${maskPattern}`);
			}
		},

		getErrorCorrectPolynomial(errorCorrectLength) {
			let polynomial = new QRPolynomial([1], 0);

			for (let index = 0; index < errorCorrectLength; index++) {
				polynomial = polynomial.multiply(new QRPolynomial([1, QRMath.gexp(index)], 0));
			}

			return polynomial;
		},

		getLengthInBits(mode, type) {
			if (1 <= type && type < 10) {
				switch (mode) {
					case QRMode.MODE_NUMBER: return 10;
					case QRMode.MODE_ALPHA_NUM: return 9;
					case QRMode.MODE_8BIT_BYTE: return 8;
					case QRMode.MODE_KANJI: return 8;
					default: throw new Error(`mode:${mode}`);
				}
			} else if (type < 27) {
				switch (mode) {
					case QRMode.MODE_NUMBER: return 12;
					case QRMode.MODE_ALPHA_NUM: return 11;
					case QRMode.MODE_8BIT_BYTE: return 16;
					case QRMode.MODE_KANJI: return 10;
					default: throw new Error(`mode:${mode}`);
				}
			} else if (type < 41) {
				switch (mode) {
					case QRMode.MODE_NUMBER: return 14;
					case QRMode.MODE_ALPHA_NUM: return 13;
					case QRMode.MODE_8BIT_BYTE: return 16;
					case QRMode.MODE_KANJI: return 12;
					default: throw new Error(`mode:${mode}`);
				}
			}

			throw new Error(`type:${type}`);
		},

		getLostPoint(qrCode) {
			const moduleCount = qrCode.getModuleCount();
			let lostPoint = 0;

			for (let row = 0; row < moduleCount; row++)
				for (let col = 0; col < moduleCount; col++) {
					let sameCount = 0;
					const dark = qrCode.isDark(row, col);

					for (let r = -1; r <= 1; r++) {
						if (row + r < 0 || moduleCount <= row + r) continue;

						for (let c = -1; c <= 1; c++) {
							if (col + c < 0 || moduleCount <= col + c) continue;

							if (r === 0 && c === 0) continue;

							if (dark === qrCode.isDark(row + r, col + c)) sameCount++;
						}
					}

					if (sameCount > 5) lostPoint += 3 + sameCount - 5;
				}

			for (let row = 0; row < moduleCount - 1; row++)
				for (let col = 0; col < moduleCount - 1; col++) {
					let count = 0;

					if (qrCode.isDark(row, col)) count++;
					if (qrCode.isDark(row + 1, col)) count++;
					if (qrCode.isDark(row, col + 1)) count++;
					if (qrCode.isDark(row + 1, col + 1)) count++;

					if (count === 0 || count === 4) lostPoint += 3;
				}

			for (let row = 0; row < moduleCount; row++) {
				for (let col = 0; col < moduleCount - 6; col++) {
					if (
						qrCode.isDark(row, col)
						&& !qrCode.isDark(row, col + 1)
						&& qrCode.isDark(row, col + 2)
						&& qrCode.isDark(row, col + 3)
						&& qrCode.isDark(row, col + 4)
						&& !qrCode.isDark(row, col + 5)
						&& qrCode.isDark(row, col + 6)
					) lostPoint += 40;
				}
			}

			for (let col = 0; col < moduleCount; col++) {
				for (let row = 0; row < moduleCount - 6; row++) {
					if (
						qrCode.isDark(row, col)
						&& !qrCode.isDark(row + 1, col)
						&& qrCode.isDark(row + 2, col)
						&& qrCode.isDark(row + 3, col)
						&& qrCode.isDark(row + 4, col)
						&& !qrCode.isDark(row + 5, col)
						&& qrCode.isDark(row + 6, col)
					) lostPoint += 40;
				}
			}

			let darkCount = 0;
			for (let col = 0; col < moduleCount; col++)
				for (let row = 0; row < moduleCount; row++)
					if (qrCode.isDark(row, col)) darkCount++;

			const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
			lostPoint += ratio * 10;

			return lostPoint;
		}
	};

	const QRMath = {
		glog(n) {
			if (n < 1) throw new Error(`glog(${n})`);
			return QRMath.LOG_TABLE[n];
		},

		gexp(n) {
			while (n < 0) n += 255;
			while (n >= 256) n -= 255;
			return QRMath.EXP_TABLE[n];
		},

		EXP_TABLE: new Uint8Array(256),
		LOG_TABLE: new Uint8Array(256)
	};

	for (let index = 0; index < 8; index++)
		QRMath.EXP_TABLE[index] = 1 << index;

	for (let index = 8; index < 256; index++)
		QRMath.EXP_TABLE[index] = QRMath.EXP_TABLE[index - 4] ^ QRMath.EXP_TABLE[index - 5] ^ QRMath.EXP_TABLE[index - 6] ^ QRMath.EXP_TABLE[index - 8];

	for (let index = 0; index < 255; index++)
		QRMath.LOG_TABLE[QRMath.EXP_TABLE[index]] = index;

	function QRPolynomial(num, shift) {
		if (num.length === undefined) throw new Error(`${num.length}/${shift}`);

		let offset = 0;
		while (offset < num.length && num[offset] === 0) offset++;

		const coefficients = num.slice(offset);
		this.num = new Uint8Array(coefficients.length + shift);
		this.num.set(coefficients);
	}

	QRPolynomial.prototype = {
		get(index) {
			return this.num[index];
		},

		getLength() {
			return this.num.length;
		},

		multiply(e) {
			const num = new Uint8Array(this.getLength() + e.getLength() - 1);

			for (let i = 0; i < this.getLength(); i++)
				for (let j = 0; j < e.getLength(); j++)
					num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));

			return new QRPolynomial(num, 0);
		},

		mod(e) {
			if (this.getLength() - e.getLength() < 0) return this;

			const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
			const num = Uint8Array.from(this.num);

			for (let index = 0; index < e.getLength(); index++)
				num[index] ^= QRMath.gexp(QRMath.glog(e.get(index)) + ratio);

			return new QRPolynomial(num, 0).mod(e);
		}
	};

	function QRRSBlock(totalCount, dataCount) {
		this.totalCount = totalCount;
		this.dataCount = dataCount;
	}

	QRRSBlock.RS_BLOCK_TABLE = [[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];

	QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
		const rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);

		if (rsBlock === undefined) throw new Error(`bad rs block @ typeNumber:${typeNumber}/errorCorrectLevel:${errorCorrectLevel}`);

		const length = rsBlock.length / 3;
		const list = [];

		for (let index = 0; index < length; index++) {
			const count = rsBlock[index * 3];
			const totalCount = rsBlock[index * 3 + 1];
			const dataCount = rsBlock[index * 3 + 2];

			for (let item = 0; item < count; item++)
				list.push(new QRRSBlock(totalCount, dataCount));
		}

		return list;
	};

	QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
		switch (errorCorrectLevel) {
			case QRErrorCorrectLevel.L: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4];
			case QRErrorCorrectLevel.M: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
			case QRErrorCorrectLevel.Q: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
			case QRErrorCorrectLevel.H: return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
			default: return undefined;
		}
	};

	function QRBitBuffer() {
		this.buffer = [];
		this.length = 0;
	}

	QRBitBuffer.prototype = {
		get(index) {
			const bufferIndex = Math.floor(index / 8);
			return ((this.buffer[bufferIndex] >>> (7 - index % 8)) & 1) === 1;
		},

		put(num, length) {
			for (let index = 0; index < length; index++)
				this.putBit(((num >>> (length - index - 1)) & 1) === 1);
		},

		getLengthInBits() {
			return this.length;
		},

		putBit(bit) {
			const bufferIndex = Math.floor(this.length / 8);

			if (this.buffer.length <= bufferIndex) this.buffer.push(0);

			if (bit) this.buffer[bufferIndex] |= 0x80 >>> (this.length % 8);

			this.length++;
		}
	};

	const QRCodeLimitLength = [[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]];
	
	const ERROR_CORRECTION_INFO = Object.freeze({
		L: Object.freeze({ key: "L", level: QRErrorCorrectLevel.L, recoveryPercent: 7, label: "Very Low" }),
		M: Object.freeze({ key: "M", level: QRErrorCorrectLevel.M, recoveryPercent: 15, label: "Low" }),
		Q: Object.freeze({ key: "Q", level: QRErrorCorrectLevel.Q, recoveryPercent: 25, label: "Medium" }),
		H: Object.freeze({ key: "H", level: QRErrorCorrectLevel.H, recoveryPercent: 30, label: "High" })
	});
	const ERROR_CORRECTION_LIMIT_INDEX = Object.freeze({
		[QRErrorCorrectLevel.L]: 0,
		[QRErrorCorrectLevel.M]: 1,
		[QRErrorCorrectLevel.Q]: 2,
		[QRErrorCorrectLevel.H]: 3
	});
	const SUPPORTED_ERROR_CORRECTION_LEVELS = new Set(Object.values(QRErrorCorrectLevel));
		const DEFAULT_MARGIN = 0;

	function _normalizeCorrectLevel(correctLevel) {
		if (typeof correctLevel === "string") {
			const normalizedKey = correctLevel.toUpperCase();

			if (Object.prototype.hasOwnProperty.call(ERROR_CORRECTION_INFO, normalizedKey)) {
				return ERROR_CORRECTION_INFO[normalizedKey].level;
			}
		}

		if (SUPPORTED_ERROR_CORRECTION_LEVELS.has(correctLevel)) {
			return correctLevel;
		}

		throw new Error(
			`Unsupported QR error correction level "${correctLevel}". Standard QR codes support only L (7%), M (15%), Q (25%), and H (30%). H is the maximum.`
		);
	}

	function _normalizeMargin(margin) {
		if (margin == null || margin === '') {
			return DEFAULT_MARGIN;
		}

		const normalizedMargin = Number(margin);

		if (!Number.isInteger(normalizedMargin) || normalizedMargin < 0) {
			throw new Error('margin must be an integer greater than or equal to 0.');
		}

		return normalizedMargin;
	}

	const svgDrawer = (function() {

		const Drawing = function (el, htOption) {
			this._el = el;
			this._htOption = htOption;
		};

		Drawing.prototype.draw = function (oQRCode) {
			const options = this._htOption;
			const element = this._el;
			const moduleCount = oQRCode.getModuleCount();
			const pathData = [];

			this.clear();

			function makeSVG(tag, attrs) {
				const svgElement = document.createElementNS('http://www.w3.org/2000/svg', tag);

				for (const [name, value] of Object.entries(attrs)) {
					svgElement.setAttribute(name, value);
				}

				return svgElement;
			}

			const viewBoxSize = moduleCount + 2 * options.margin;
			const svg = makeSVG("svg" , {'viewBox': `0 0 ${viewBoxSize} ${viewBoxSize}`, 'width': '100%', 'height': '100%', 'fill': options.colorLight, 'shape-rendering': 'crispEdges'});
			element.appendChild(svg);

			svg.appendChild(makeSVG("rect", {"fill": options.colorLight, "width": "100%", "height": "100%"}));

			for (let row = 0; row < moduleCount; row++) {
				for (let col = 0; col < moduleCount; col++) {
					if (oQRCode.isDark(row, col)) {
						pathData.push(
							"M",
							String(col + options.margin),
							" ",
							String(row + options.margin),
							"h1v1h-1z"
						);
					}
				}
			}

			if (pathData.length > 0) {
				svg.appendChild(makeSVG("path", {
					"fill": options.colorDark,
					"d": pathData.join("")
				}));
			}
		};
		Drawing.prototype.clear = function () {
			while (this._el.hasChildNodes()) {
				this._el.removeChild(this._el.lastChild);
			}
		};
		Drawing.prototype.destruct = function () {
			this.clear(); // removes all child nodes including svg root
		};
		return Drawing;
	})();

	// Drawing in DOM by using a table element.
	const tableDrawer = (function () {
		const Drawing = function (el, htOption) {
			this._el = el;
			this._htOption = htOption;
		};
			
		/**
		 * Draw the QRCode
		 * 
		 * @param {QRCode} oQRCode
		 */
		Drawing.prototype.draw = function (oQRCode) {
			const options = this._htOption;
			const element = this._el;
			const moduleCount = oQRCode.getModuleCount();
			const totalColumns = moduleCount + 2 * options.margin;
			const cellWidth = options.width / totalColumns;
			const cellHeight = options.height / totalColumns;
			const tableStyle = 'border:0;border-collapse:collapse;';
			const cellStyle = `border:0;border-collapse:collapse;padding:0;margin:0;width:${cellWidth}px;height:${cellHeight}px;`;
			const lightCell = `<td style="${cellStyle}background-color:${options.colorLight};"></td>`;
			const darkCell = `<td style="${cellStyle}background-color:${options.colorDark};"></td>`;
			const marginColumns = lightCell.repeat(options.margin);
			const marginRow = `<tr>${lightCell.repeat(totalColumns)}</tr>`;
			const html = [`<table style="${tableStyle}">`];

			for (let row = 0; row < options.margin; row++) {
				html.push(marginRow);
			}

			for (let row = 0; row < moduleCount; row++) {
				const rowHtml = ['<tr>', marginColumns];

				for (let col = 0; col < moduleCount; col++) {
					rowHtml.push(oQRCode.isDark(row, col) ? darkCell : lightCell);
				}

				rowHtml.push(marginColumns, '</tr>');
				html.push(rowHtml.join(''));
			}

			for (let row = 0; row < options.margin; row++) {
				html.push(marginRow);
			}

			html.push('</table>');
			element.innerHTML = html.join('');
			
			// Fix the margin values as real size.
			const tableElement = element.firstElementChild;
			const leftMargin = (options.width - tableElement.offsetWidth) / 2;
			const topMargin = (options.height - tableElement.offsetHeight) / 2;
			
			if (leftMargin > 0 && topMargin > 0) {
				tableElement.style.margin = `${topMargin}px ${leftMargin}px`;
			}
		};
		
		/**
		 * Clear the QRCode
		 */
		Drawing.prototype.clear = function () {
			this._el.replaceChildren();
		};
		Drawing.prototype.destruct = function () {
			this.clear(); // removes all child nodes including svg root
		};
		
		return Drawing;
	})();
	
	const canvasDrawer = (function () { // Drawing in Canvas
		function _applyImageFromCanvas() {
			this._elImage.src = this._elCanvas.toDataURL("image/png");
			this._elImage.style.cssText = this._htOption.imgStyle;
			this._elCanvas.style.display = "none";
		}
		
		/**
		 * Drawing QRCode by using canvas
		 * 
		 * @constructor
		 * @param {HTMLElement} el
		 * @param {Object} htOption QRCode Options 
		 */
		const Drawing = function (el, htOption) {
    		this._bIsPainted = false;

			this._htOption = htOption;
			this._elCanvas = document.createElement("canvas");
			this._elCanvas.width = htOption.width;
			this._elCanvas.height = htOption.height;
			el.appendChild(this._elCanvas);
			this._el = el;
			this._oContext = this._elCanvas.getContext("2d");
			this._bIsPainted = false;
			this._elImage = document.createElement("img");
			this._elImage.alt = "Scan me!";
			this._elImage.style.display = "none";
			this._el.appendChild(this._elImage);
		};
			
		/**
		 * Draw the QRCode
		 * 
		 * @param {QRCode} oQRCode 
		 */
		Drawing.prototype.draw = function (oQRCode) {
			const image = this._elImage;
			const context = this._oContext;
			const options = this._htOption;
			const moduleCount = oQRCode.getModuleCount();
			const cellWidth = options.width / (moduleCount + 2 * options.margin);
			const cellHeight = options.height / (moduleCount + 2 * options.margin);
			const offsetX = options.margin * cellWidth;
			const offsetY = options.margin * cellHeight;
			const roundedWidth = Math.round(cellWidth);
			const roundedHeight = Math.round(cellHeight);

			image.style.display = "none";
			this.clear();

			// Paint the full background once, then draw only dark modules.
			context.lineWidth = 1;
			context.fillStyle = options.colorLight;
			context.fillRect(0, 0, options.width, options.height);
			context.fillStyle = options.colorDark;
			context.strokeStyle = options.colorDark;

			for (let row = 0; row < moduleCount; row++) {
				for (let col = 0; col < moduleCount; col++) {
					if (!oQRCode.isDark(row, col)) continue;

					const left = col * cellWidth + offsetX;
					const top = row * cellHeight + offsetY;
					context.fillRect(left, top, cellWidth, cellHeight);

					// Draw both stroke variants to reduce anti-aliasing seams.
					context.strokeRect(
						Math.floor(left) + 0.5,
						Math.floor(top) + 0.5,
						roundedWidth,
						roundedHeight
					);
					
					context.strokeRect(
						Math.ceil(left) - 0.5,
						Math.ceil(top) - 0.5,
						roundedWidth,
						roundedHeight
					);
				}
			}
			
			this._bIsPainted = true;
		};
			
		/**
		 * Defer image generation so wrapper code can still decorate the canvas first.
		 */
		Drawing.prototype.makeImage = function () {
			if (this._bIsPainted) {
				queueMicrotask(_applyImageFromCanvas.bind(this));
			}
		};
			
		/**
		 * Return whether the QRCode is painted or not
		 * 
		 * @return {Boolean}
		 */
		Drawing.prototype.isPainted = function () {
			return this._bIsPainted;
		};
		
		/**
		 * Paints the canvas white, ignores the alt image
		 */
		Drawing.prototype.clear = function () {
			this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
			this._bIsPainted = false;
		};
		
		/**
		 * Destruct the QRCode to create a new one with different drawing method on the same element.
		 * removes all child nodes including canvas and img tag
		 */
		Drawing.prototype.destruct = function () {
			this._el.replaceChildren();
		};
		
		return Drawing;
	})();
	
	/**
	 * Get the type by string length
	 * 
	 * @private
	 * @param {String} sText
	 * @param {Number} nCorrectLevel
	 * @return {Number} type
	 */
	function _getTypeNumber(sText, nCorrectLevel) {			
		let typeNumber = 1;
		const textLength = _getUTF8Length(sText);
		const correctLevel = _normalizeCorrectLevel(nCorrectLevel);
		const limitIndex = ERROR_CORRECTION_LIMIT_INDEX[correctLevel];
		
		for (let index = 0, length = QRCodeLimitLength.length; index < length; index++) {
			const limit = QRCodeLimitLength[index][limitIndex];
			
			if (textLength <= limit) {
				return typeNumber;
			}

			typeNumber++;
		}
		
		throw new Error("Too long data");
	}

	function _getUTF8Length(sText) {
		return _encodeUtf8Bytes(sText).length;
	}

	function _normalizeTypeNumber(typeNumber, optionName) {
		const normalizedTypeNumber = Number(typeNumber);

		if (typeNumber == null || typeNumber === '' || normalizedTypeNumber === 0) {
			return 0;
		}

		if (!Number.isInteger(normalizedTypeNumber) || normalizedTypeNumber < 1 || normalizedTypeNumber > 40) {
			throw new Error(`${optionName} must be 0 for automatic sizing or an integer from 1 to 40.`);
		}

		return normalizedTypeNumber;
	}

	function _resolveTypeNumber(sText, correctLevel, options) {
		const autoTypeNumber = _getTypeNumber(sText, correctLevel);
		const explicitTypeNumber = _normalizeTypeNumber(options.typeNumber, 'typeNumber');
		const minimumTypeNumber = _normalizeTypeNumber(options.minTypeNumber, 'minTypeNumber');

		if (explicitTypeNumber > 0) {
			if (explicitTypeNumber < autoTypeNumber) {
				throw new Error(`typeNumber ${explicitTypeNumber} is too small for this content at the selected error correction level. Minimum required version is ${autoTypeNumber}.`);
			}

			return explicitTypeNumber;
		}

		return Math.max(autoTypeNumber, minimumTypeNumber);
	}
	
	/**
	 * @class QRCode
	 * @constructor
	 * @example 
	 * new QRCode(document.getElementById("test"), "https://qrcode.shaunroselt.com/?page=url");
	 *
	 * @example
	 * const oQRCode = new QRCode("test", {
	 *    text : "WIFI:T:WPA;S:QR Demo WiFi;P:scanme123;;",
	 *    width : 128,
	 *    height : 128
	 * });
	 * 
	 * oQRCode.clear(); // Remove the current QR code.
	 * oQRCode.makeCode("https://qrcode.shaunroselt.com/?page=wifi"); // Render a new QR code for another app flow.
	 *
	 * @param {HTMLElement|String} el target element or 'id' attribute of element.
	 * @param {Object|String} vOption
	 * @param {String} vOption.text QR code data to encode.
	 * @param {Number} [vOption.typeNumber=0] Exact QR version. Use 0 to size automatically.
	 * @param {Number} [vOption.minTypeNumber=0] Minimum QR version to use when sizing automatically.
	 * @param {Number} [vOption.width=256]
	 * @param {Number} [vOption.height=256]
	 * @param {Number} [vOption.margin=0] Outer padding around the QR matrix in modules.
	 * @param {String} [vOption.colorDark="#000000"]
	 * @param {String} [vOption.colorLight="#ffffff"]
	 * @param {QRCode.CorrectLevel|"L"|"M"|"Q"|"H"} [vOption.correctLevel=QRCode.CorrectLevel.H] Standard QR codes only support L, M, Q, and H. H is the maximum. 
	 */
	QRCode = function (el, vOption) {
		this._htOption = {
			width : 256, 
			height : 256,
			margin: DEFAULT_MARGIN,
			typeNumber : 0,
			minTypeNumber : 0,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRErrorCorrectLevel.H,
			imgStyle : "display:block; max-width:100%;"
		};
		
		if (typeof vOption === 'string') {
			vOption = {
				text : vOption
			};
		}

		if (vOption && Object.prototype.hasOwnProperty.call(vOption, 'border') && !Object.prototype.hasOwnProperty.call(vOption, 'margin')) {
			vOption = {
				...vOption,
				margin: vOption.border
			};
		}
		
		// Override default options with any user-provided values.
		if (vOption) {
			Object.assign(this._htOption, vOption);
		}

		this._htOption.margin = _normalizeMargin(this._htOption.margin);
		delete this._htOption.border;
		this._htOption.correctLevel = _normalizeCorrectLevel(this._htOption.correctLevel);
		this._htOption.typeNumber = _normalizeTypeNumber(this._htOption.typeNumber, 'typeNumber');
		this._htOption.minTypeNumber = _normalizeTypeNumber(this._htOption.minTypeNumber, 'minTypeNumber');
		
		if (typeof el === "string") {
			el = document.getElementById(el);
		}

		if (!el) {
			throw new Error("QRCode target element was not found.");
		}
		
		// Select the output renderer.
		switch (this._htOption.output) {
			case "svg":
				Drawing = svgDrawer;
				break;
			case "table":
				Drawing = tableDrawer;
				break;
			default:
				Drawing = canvasDrawer;
				break;
		}
		
		this._el = el;
		this._oQRCode = null;
		this._oDrawing = new Drawing(this._el, this._htOption);
		
		if (this._htOption.text) {
			this.setCode(this._htOption.text);
		}
	};
	
	/**
	 * Create or replace the current QR code.
	 * 
	 * @param {String} sText Deprecated. Use setCode(sText) instead.
	 */
	QRCode.prototype.makeCode = function (sText) {
		this.setCode(sText);
	};
	
	/**
	 * Reset the QR code content and redraw the code.
	 * 
	 * @param {String} sText QR code data to encode.
	 */
	QRCode.prototype.setCode = function (sText) {
		const correctLevel = _normalizeCorrectLevel(this._htOption.correctLevel);
		const typeNumber = _resolveTypeNumber(sText, correctLevel, this._htOption);

		this._htOption.margin = _normalizeMargin(this._htOption.margin);
		delete this._htOption.border;
		this._htOption.correctLevel = correctLevel;
		this._htOption.typeNumber = _normalizeTypeNumber(this._htOption.typeNumber, 'typeNumber');
		this._htOption.minTypeNumber = _normalizeTypeNumber(this._htOption.minTypeNumber, 'minTypeNumber');
		this._oQRCode = new QRCodeModel(typeNumber, correctLevel);
		this._oQRCode.addData(sText); // A new model instance is created each time, so this replaces the encoded content.
		this._oQRCode.make();
		this._el.title = sText;
		this._oDrawing.draw(this._oQRCode);
		this.makeImage();
	};

	QRCode.prototype.getTypeNumber = function () {
		return this._oQRCode ? this._oQRCode.typeNumber : null;
	};
	
	/**
	 * Create the image from the canvas element.
	 * This happens automatically.
	 * 
	 * @private
	 */
	QRCode.prototype.makeImage = function () {
		if (typeof this._oDrawing.makeImage === "function") {
			this._oDrawing.makeImage();
		}
	};
	
	/**
	 * Clear the QR code and reset it to white without removing the canvas or PNG elements.
	 */
	QRCode.prototype.clear = function () {
		this._oDrawing.clear();
	};
	
	/**
	 * Remove all created elements so you can create a new QR code on the original element.
	 */
	QRCode.prototype.destruct = function () {
		this._oDrawing.destruct();
	};
	
	/**
	 * @name QRCode.CorrectLevel
	 */
	QRCode.CorrectLevel = QRErrorCorrectLevel;
	QRCode.CorrectLevelInfo = ERROR_CORRECTION_INFO;
})();