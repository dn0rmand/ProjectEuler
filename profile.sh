node --prof $1
ISOLATE=`ls isolate*.log`
echo ${ISOLATE}
node --prof-process ${ISOLATE} > profiler.txt
rm ${ISOLATE}
code profiler.txt
sleep 5
rm profiler.txt